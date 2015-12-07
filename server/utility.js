var _ = require('underscore');
module.exports = {
  createEvent: function (db, code, username) {
    return db('users').insert({username: username})
    .returning('id')
    .then(function (userId) {
      return db('events').insert({code: code})
      .returning('id')
      .then(function (eventId) {
        return db('usersJoinEvents').insert({user_id: userId[0], event_id: eventId[0], host: true, status: true}).returning('id');
      });
    })
  },

  createUser: function (db, username, eventId, host) {
   return db('users').insert({username: username})
    .returning('id')
    .then(function (userId) {
      return db('usersJoinEvents').insert({user_id: userId[0], event_id: eventId, status: false, host: host}).returning('user_id');
    })

  },

  createDish: function (db, dishName, cost, userId, eventId) {
    return db('dishes').insert({name: dishName, cost: cost, event_id: eventId})
    .returning('id')
    .then(function (dishId) {
      return db('usersJoinDishes').insert({user_id: userId, dish_id: dishId[0]}).returning('id');
    })
  },

  shareDish: function (db, userId, dishId) {
    return db('usersJoinDishes').insert({user_id: userId, dish_id: dishId});
  },

  unshareDish: function (db, userId, dishId) {
    return db('usersJoinDishes').where({user_id: userId, dish_id: dishId}).del();
  },

  gatherState: function (db, eventId, code) {
    var state = {eventId: eventId, code: code};
    return module.exports.findEventUsers(db, eventId)
    .then(function (users) {
      state.users = users;
      return Promise.all(_.map(users, function (user) {
        return module.exports.findUserDishes(db, user.id)
      }))
      .then(function (usersDishesArrays) {
        usersDishesArrays.forEach(function (userDishesArray){
          _.each(state.users, function (userObj, index, list) {
            var username = userObj.username;
            userDishesArray.forEach(function (dishObj) {
              if (username === dishObj.username) {
                if (list[index].dishes === undefined) {
                  list[index].dishes = [];
                }
                list[index].dishes.push(dishObj);
              }
            });
          });
        });
        state.dishes = module.exports.findDishArray(usersDishesArrays);
        return state;
      });
    })
    .catch(function (err) {
      throw err;
    })
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

  //example output from findEventUsers
  //[{username: 'Fawn', status: true, host: true, id: 7 }]
  findEvent: function (db, code) {
    return db('events').where({code: code}).select('id')
  },

  findEventUsers: function (db, eventId) {
    return db.select('users.username', 'usersJoinEvents.status', 'usersJoinEvents.host', 'users.id').from('events').leftJoin('usersJoinEvents', 'events.id', 'usersJoinEvents.event_id').leftJoin('users', 'users.id', 'usersJoinEvents.user_id').where('events.id', eventId)
  },

  findUserDishes: function (db, userId) {
    return db.select().from('users').leftJoin('usersJoinDishes', 'users.id', 'usersJoinDishes.user_id').leftJoin('dishes', 'dishes.id', 'usersJoinDishes.dish_id').where('users.id', userId)
  },

  generateCode: function () {
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    return randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  },

  findDishArray: function (usersDishesArray) {
    var result = [];
    usersDishesArray.forEach(function (dishArray) {
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
}
