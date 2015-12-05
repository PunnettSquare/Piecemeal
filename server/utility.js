var _ = require('underscore');
module.exports = {
  createEvent: function(db, code, username) {
    return db('users').insert({username: username})
    .returning('id')
    .then(function(userId) {
      return db('events').insert({code: code})
      .returning('id')
      .then(function(eventId) {
        return db('usersJoinEvents').insert({user_id: userId[0], event_id: eventId[0], host: true, status: true}).returning('id');
      });
    })
    .catch(function(err) {
      // callback(err)
    })
  },

  createUser: function(db, username, eventId, host) {
    //add event and add join table
   return db('users').insert({username: username})
    .returning('id')
    .then(function(userId) {
      return db('usersJoinEvents').insert({user_id: userId[0], event_id: eventId, status: false, host: host})
    })
  },

  createDish: function(db, dishName, cost, userId, eventId) {
    return db('dishes').insert({name: dishName, cost: cost, event_id: eventId})
    .returning('id')
    .then(function(dishId) {
      return db('usersJoinDishes').insert({user_id: userId, dish_id: dishId[0]}).returning('id');
    })
  },

  gatherState: function(db, eventId, code) {
    var state = {eventId: eventId, code: code};
    return module.exports.findEventUsers(db, eventId)
    .then(function(users) {
      state.users = users;
      return Promise.all(_.map(users, function(user) {
        return module.exports.findUserDishes(db, user.id)
      }))
      .then(function(usersDishesArrays) {
        usersDishesArrays.forEach(function(userDishesArray){
          _.each(state.users, function(userObj, index, list) {
            var username = userObj.username;
            userDishesArray.forEach(function(dishObj) {
              if (username === dishObj.username) {
                if (list[index].dishes === undefined) {
                  list[index].dishes = [];
                }
                list[index].dishes.push(dishObj);
              }
            });
          });
        });
        return state;
      });
    })
    .catch(function(err) {
      console.error(err);
    })
  },
  // [ { id: 3,
  //     username: 'Fawn',
  //     status: null,
  //     host: null,
  //     dish_id: 3,
  //     user_id: 7,
  //     name: 'chicken',
  //     cost: 10,
  //     event_id: 7 },
  // ]

  //[{username: 'Fawn', status: true, host: true, id: 7 }]
  findEvent: function(db, code) {
    return db('events').where({code: code}).select('id')
  },

  findEventUsers: function(db, eventId) {
    return db.select('users.username', 'usersJoinEvents.status', 'usersJoinEvents.host', 'users.id').from('events').leftJoin('usersJoinEvents', 'events.id', 'usersJoinEvents.event_id').leftJoin('users', 'users.id', 'usersJoinEvents.user_id').where('events.id', eventId)
    // .then(console.log)
  },

  findUserDishes: function(db, userId) {
    return db.select().from('users').leftJoin('usersJoinDishes', 'users.id', 'usersJoinDishes.user_id').leftJoin('dishes', 'dishes.id', 'usersJoinDishes.dish_id').where('users.id', userId)
    // .then(console.log)
  }
}

// var eventInfo = {
//    eventId: 1,
//    users: [{
//      userId: 3,
//      username: 'Jackson',
//      dishes: [{
//        dishId: 1,
//        cost: 10,
//        name: 'Chicken Salad'
//      }]
//    }, {
//      userId: 2,
//      username: 'Michelle',
//      dishes: [{
//        dishId: 3,
//        cost: 12,
//        name: 'Hamburger'
//      }]
//    }]
//  };
