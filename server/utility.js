// # Utility and Helper Functions

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Various helper functions which interact with the database

var _ = require('underscore');
var roomNames = require('./roomNames.js');

module.exports = {
  // Create event in database and populate users and events junction table
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
  // Check if a event code exists in the database
  checkCode: function(db, code) {
    return db('events').where({
        code: code
      })
      .then(function(data) {
        if (data.length === 0) {
          return false;
        } else {
          data[0].isValid = true;
          console.log('code in util', data[0])
          return data[0];
        }
      });
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

  addTipAndTax: function(db, event_id, taxPercent, tipPercent, feePercent, discountPercent, billSent) {
    return db('events').where({
      'id': event_id
    }).update({
      taxPercent: taxPercent,
      tipPercent: tipPercent,
      feePercent: feePercent,
      discountPercent: discountPercent,
      billSent: billSent
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

  addVenmoUser: function (db, event_id, user_id) {
    return db('usersJoinEvents').where({
        event_id: event_id,
        user_id: user_id
      })
      .then(function(data) {
        if (data.length === 0) {
          return  db('usersJoinEvents').insert({
            user_id: user_id,
            event_id: event_id,
            status: false,
            host: false
          })
        } else {
          return
        } 
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
          dish_id: dish_id[0],
          portions: 1
        }).returning('id');
      })
      .then(function() {
        return {
          dish_id: dishId
        };
      });
  },

  shareDish: function(db, user_id, dish_id) {
    return db('usersJoinDishes')
    .where({
        dish_id: dish_id,
        user_id: user_id
      })
      .then(function(data) {
        console.log('data in shareDish:', data)
        if (data.length === 0) {
          return db('usersJoinDishes').insert({
            user_id: user_id,
            dish_id: dish_id,
            portions: 1
          });
        } else {
         return db('usersJoinDishes').where({
            user_id: user_id,
            dish_id: dish_id
          }).update({
            portions: 1 + data[0].portions
          });
        }
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
    return db.select('event_id')
    .from('usersJoinEvents')
    .where('usersJoinEvents.user_id', user_id);
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
        state.billData.billSent = amendmentsObj[0].billSent;
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
                // Add dish models to each user in the state
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
                // Add dish models section to state object
                state.dishes = module.exports.findDishArray(usersDishesArrays);

                return state;
              });
          });
      })
      .catch(function(err) {
        throw err;
      });
  },

  findEvent: function(db, code) {
    return db('events').where({
      code: code
    }).select('id');
  },

  findEventUsers: function(db, event_id) {
    return db.select('users.username', 'usersJoinEvents.status', 'usersJoinEvents.host', 'users.id', 'users.venmoUsername')
    .from('events')
    .leftJoin('usersJoinEvents', 'events.id', 'usersJoinEvents.event_id')
    .leftJoin('users', 'users.id', 'usersJoinEvents.user_id')
    .where('events.id', event_id);
  },

  findUserDishes: function(db, user_id, event_id) {
    return db.select()
    .from('users')
    .innerJoin('usersJoinDishes', 'users.id', 'usersJoinDishes.user_id')
    .innerJoin('dishes', 'dishes.id', 'usersJoinDishes.dish_id')
    .where('users.id', user_id)
      .then(function(dishes) {
        // Dishes
        // [ { id: 9,
        //     username: 'asdfas',
        //     venmoUsername: null,
        //     phone: null,
        //     email: null,
        //     dish_id: 9,
        //     user_id: 11,
        //     portions: 1,
        //     name: 'asdfas',
        //     cost: '12.00',
        //     event_id: 8 } ]
        return dishes.filter(function(dish) {
          return dish.event_id === event_id;
        });
      });
  },

  findBillAmendments: function(db, event_id) {
    return db('events')
    .select('tipPercent', 'taxPercent', 'feePercent', 'discountPercent', 'billSent')
    .where('id', event_id);
  },

  generateCode: function(db) {
    return db('appSettings').select('*').where('id', 1)
    .then(function(setting) {
        return setting[0]
    })
    .then(function(settings) {
      var code = roomNames[settings.wordIndex]
      if (settings.wordIndex === roomNames.length-1) {
        settings.wordIndex = 0;
        settings.counter++
      } else {
        settings.wordIndex++
      }
      code = settings.counter > 0 ? code + settings.counter : code;
      return db('appSettings').update({
        wordIndex: settings.wordIndex,
        counter: settings.counter
      })
      .then(function(word) {
        return code
      })
    })
  },

  setFirstWord: function (db) {
    return db('appSettings').select('*').where('id', 1)
    .then(function(setting) {
      if (setting.length === 0) {
        return db('appSettings').insert({
          wordIndex: 0,
          counter: 0
        })
      } else {
        return setting[0]
      }
    })
  },

  findDishArray: function(usersDishesArray) {
    var result = [];
    usersDishesArray.forEach(function(dishArray) {
      // Dish Array
      // [ { id: 9,
      //     username: 'asdfas',
      //     venmoUsername: null,
      //     phone: null,
      //     email: null,
      //     dish_id: 9,
      //     user_id: 11,
      //     portions: 1,
      //     name: 'asdfas',
      //     cost: '12.00',
      //     event_id: 8 } ]
      dishArray.forEach(function(dishObj) {
        //check if dish is shared
        var isSharedDish = result.reduce(function(isInside, dish, index) {
          if (isInside) {
            return true;
          }
          if (dish.dish_id === dishObj.dish_id) {
            //if so, add user to users prop, as many times as the portions that user has
            while (dishObj.portions) {
              result[index].users.push(dishObj.user_id);
              dishObj.portions--;
            }
            return true;
          }
        }, false);

        if (!isSharedDish) {
          //otherwise add user prop and push into array for as many portions as user has
          dishObj.users = [];
          while (dishObj.portions) {
            dishObj.users.push(dishObj.user_id);
            dishObj.portions--;
          }            
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
