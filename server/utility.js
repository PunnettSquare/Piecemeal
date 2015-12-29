var _ = require('underscore');
var roomNames = require('./roomNames.js');
var counter = 0; // for room names
var incrementer = 0;

module.exports = {
  createEvent: function(db, code, username) {
    return db('users').insert({
        username: username
      })
      .returning('id')
      .then(function(user_id) {
        return db('events').insert({
            code: code
          })
          .returning('id')
          .then(function(event_id) {
            return db('usersJoinEvents').insert({
                user_id: user_id[0],
                event_id: event_id[0],
                host: true,
                status: true
              }).returning('id')
              .then(function() {
                return {
                  event_id: event_id,
                  user_id: user_id
                };
              });
          });
      });
  },

  checkCode: function (db, code) {
    return db('events').where({
      code:code
    })
    .then(function(data) {
      if (data.length === 0) {
        return false;
      } else {
        data[0].isValid = true;
        return data[0];
      }
    })
  },

  createEventVenmo: function(db, code, user_id) {
    return db('events').insert({
        code: code
      })
      .returning('id')
      .then(function(event_id) {
        return db('usersJoinEvents').insert({
            user_id: user_id,
            event_id: event_id[0],
            host: true,
            status: true
          })
          .returning('event_id');
      });
  },

  findUser: function(db, venmoUsername) {
    return db('users').where({
      venmoUsername: venmoUsername
    });
  },

  addTipAndTax: function(db, event_id, taxPercent, tipPercent, feePercent, discountPercent) {
    return db('events').where({
      'id': event_id
    }).update({
      taxPercent: taxPercent,
      tipPercent: tipPercent,
      feePercent: feePercent,
      discountPercent: discountPercent
    });
  },

  createUser: function(db, username, event_id, host) {
    return db('users').insert({
        username: username
      })
      .returning('id')
      .then(function(user_id) {
        return db('usersJoinEvents').insert({
          user_id: user_id[0],
          event_id: event_id,
          status: false,
          host: host
        }).returning('user_id');
      });
  },

  createDish: function(db, dishName, cost, user_id, event_id) {
    var dishId;
    return db('dishes').insert({
        name: dishName,
        cost: cost,
        event_id: event_id
      })
      .returning('id')
      .then(function(dish_id) {
        dishId = dish_id;
        return db('usersJoinDishes').insert({
          user_id: user_id,
          dish_id: dish_id[0]
        }).returning('id');
      })
      .then(function() {
        return {
          dish_id: dishId
        };
      });
  },

  shareDish: function(db, user_id, dish_id) {
    return db('usersJoinDishes').insert({
      user_id: user_id,
      dish_id: dish_id
    });
  },

  unshareDish: function(db, user_id, dish_id) {
    return db('usersJoinDishes').where({
        user_id: user_id,
        dish_id: dish_id
      }).del()
      .then(function() {
        return db('usersJoinDishes').where({
            dish_id: dish_id
          })
          .returning('id');
      })
      .then(function(ids) {
        if (ids.length === 0) {
          return db('dishes').where({
            id: dish_id
          }).del();
        } else {
          return;
        }
      });
  },

  removeDish: function(db, dish_id) {
    return db('usersJoinDishes').where({
        dish_id: dish_id
      }).del()
      .then(function() {
        return db('dishes').where({
          dish_id: dish_id
        }).del();
      });
  },

  gatherEvents: function(db, user_id) {
    return module.exports.getUsersEvents(db, user_id)
      .then(function(ids) {
        return module.exports.getCodes(db, ids);
      })
      .then(function(arrays) {
        return Promise.all(_.map(arrays, function(idCodeArray) {
          return module.exports.gatherState(db, idCodeArray[0], idCodeArray[1]);
        }));
      });
  },

  gatherBillInfo: function(db, event_id) {
    // return    db.select().from('events').innerJoin('usersJoinEvents', 'events.event_id', 'usersJoinEvents.event_id')
  },

  getCodes: function(db, ids) {
    return Promise.all(_.map(ids, function(id) {
      return db('events').where({
          id: id.event_id
        }).returning('code')
        .then(function(data) {
          return [id.event_id, data[0].code];
        });
    }));
  },

  getUsersEvents: function(db, user_id) {
    return db.select('event_id').from('usersJoinEvents').where('usersJoinEvents.user_id', user_id);
  },

  gatherState: function(db, event_id, code) {
    var state = {
      event_id: event_id,
      code: code,
      billData: {}
    };
    return module.exports.findBillAmendments(db, event_id)
      .then(function(amendmentsObj) {
        state.billData.tipPercent = Number(amendmentsObj[0].tipPercent);
        state.billData.taxPercent = Number(amendmentsObj[0].taxPercent);
        state.billData.feePercent = Number(amendmentsObj[0].feePercent);
        state.billData.discountPercent = Number(amendmentsObj[0].discountPercent);
      }).then(function() {
        return module.exports.findEventUsers(db, event_id)
          .then(function(users) {
            state.users = users;
            users.forEach(function(user) {
              if (!!user.venmoUsername && user.host) {
                state.venmoUsername = user.venmoUsername;
              }
            });
            return Promise.all(_.map(users, function(user) {
                return module.exports.findUserDishes(db, user.id, event_id);
              }))
              .then(function(usersDishesArrays) {
                usersDishesArrays.forEach(function(userDishesArray) {
                  _.each(state.users, function(userObj, index, list) {
                    var username = userObj.username;
                    if (list[index].dishes === undefined) {
                      list[index].dishes = [];
                    }
                    userDishesArray.forEach(function(dishObj) {
                      if (username === dishObj.username) {
                        list[index].dishes.push(dishObj);
                      }
                    });
                  });
                });
                state.dishes = module.exports.findDishArray(usersDishesArrays);

                return state;
              });
          });
      })
      .catch(function(err) {
        throw err;
      });
  },

  // example output from findUserDishes
  // [ { id: 3,
  //     username: 'Fawn',
  //     dish_id: 3,
  //     user_id: 7,
  //     name: 'chicken',
  //     cost: 10,
  //     event_id: 7 },
  // ]
  // example output from findEventUsers
  //[{username: 'Fawn', status: true, host: true, id: 7 }]
  findEvent: function(db, code) {
    return db('events').where({
      code: code
    }).select('id');
  },

  findEventUsers: function(db, event_id) {
    return db.select('users.username', 'usersJoinEvents.status', 'usersJoinEvents.host', 'users.id', 'users.venmoUsername').from('events').leftJoin('usersJoinEvents', 'events.id', 'usersJoinEvents.event_id').leftJoin('users', 'users.id', 'usersJoinEvents.user_id').where('events.id', event_id);
  },

  findUserDishes: function(db, user_id, event_id) {
    return db.select().from('users').innerJoin('usersJoinDishes', 'users.id', 'usersJoinDishes.user_id').innerJoin('dishes', 'dishes.id', 'usersJoinDishes.dish_id').where('users.id', user_id)
      .then(function(dishes) {
        return dishes.filter(function(dish) {
          return dish.event_id === event_id;
        });
      }); // TODO only get dishes associated with the event
  },

  findBillAmendments: function(db, event_id) {
    return db('events').select('tipPercent', 'taxPercent', 'feePercent', 'discountPercent')
      .where('id', event_id);
  },

  // randomly generated string
  // generateCode: function() {
  //   function randomString(length, chars) {
  //     var result = '';
  //     for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  //     return result;
  //   }
  //   return randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  // }

  // food related words
  generateCode: function() {
    if (counter === roomNames.length) {
      incrementer++;
      counter = 0;
    }
    if (incrementer > 0) {
      return roomNames[counter++] + incrementer;
    } else {
      return roomNames[counter++];
    }
  },

  findDishArray: function(usersDishesArray) {
    var result = [];
    usersDishesArray.forEach(function(dishArray) {
      dishArray.forEach(function(dishObj) {
        //check if dish is shared
        var isSharedDish = result.reduce(function(isInside, dish, index) {
          if (isInside) {
            return true;
          }
          if (dish.dish_id === dishObj.dish_id) {
            //if so, add user to users prop
            result[index].users.push(dishObj.user_id);
            return true;
          }
        }, false);

        if (!isSharedDish) {
          //otherwise add user prop and push into array
          dishObj.users = [dishObj.user_id];
          delete dishObj.user_id;
          delete dishObj.username;
          delete dishObj.id;
          result.push(dishObj);
        }
      });
    });
    return result;
  }
};
