(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', '$scope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, $scope) {

    var self = this;
    self.listOfDishes = []; // dishes and users per dish
    self.yourTotal = 0;
    self.groupTotal = 0;
    self.listOfUsers = []; // FUTURE feature, for having floating active users

    socketFactory.init();

    socketFactory.on('join', function(data) {
      console.log("receiving data for join", data);
      self.socketmessage = "data: " + data;
      $scope.data = data;
    });

    socketFactory.on('dishAdded', function(data) {
      self.listOfMeals.push(data);
    });

    self.goToAddDish = function () {
      $location.path('/' + $window.location.toString().split('/')[4] + '/addDish');
    }

    allDishesFactory.getEventInfo();

    $scope.getId = function (arrayOfIds, eventInfo) {
      var usernames = arrayOfIds.map(function(id) {
        var result;
        eventInfo.users.forEach(function(user) {
          if (user.id === id) {
            result = user.username;
          }
        });
        if (result) {
          return result;
        }
      })
      return usernames.length === 1 ? usernames[0] : usernames.join(', ');
    }

    self.shareDish = function(dishId) { //nclick must access dishId** figure out how to provide these
      socketFactory.emit('shareDish', { // server needs .on(shareDish) that adds user to Dish
        dishId: dishId,
        userId: userId // ** ask Michelle how to get user from session
      });
      // update this dish's shared users in self.listOfDishes to include user
      // update self.groupTotal
    };

    self.unshareDish = function (dishId, userId) {
      socketFactory.emit('unshareDish', { // server needs .on(unshareDish) that adds user to Dish
        dishId: dishId,
        userId: userId
      });
      // update this dish's shared users in self.listOfDishes to remove user
      // update self.groupTotal
    };

    // For future floating active users feature:
    // socketFactory.on('addUser', function(data) {
    //   console.log("----->Upon new user joining, received this user data: ", data);
    //   self.listOfUsers.push = data;
    // });

  }
})();

    /* current format of data:
      {
        eventId: 1,
        users: [
          {
            dishes: [{
              cost: ,
              dishId: ,
              name:
            }],
            userId: ,
            username:
          },
          {
            dishes: [{
              cost: ,
              dishId: ,
              name:
            }],
            userId: ,
            username:
          }
        ]
      }
    */

    /* Future format of data: BUT INCORRECT. We need a list of dishes, not users.
        { eventId: 1,
          code: 'testRoom', // <---- will be added later on
          users: 
           [ { username: 'Jackson',
               status: true,
               host: true,
               id: 1,
               dishes: '[{
                 "id":1,
                 "username":"Jackson",
                 "dish_id":1,
                 "user_id":1,
                 "name":"chicken",
                 "cost":10,"event_id":1
               },
               {
                  "id":2,
                  "username":"Jackson",
                  "dish_id":2,
                  "user_id":1,
                  "name":"rice",
                  "cost":13,
                  "event_id":1
                }]'
              },
             { username: 'Jack',
               status: false,
               host: false,
               id: 2,
               dishes: '[{
                "id":5,
                "username":"Jack",
                "dish_id":5,
                "user_id":2,
                "name":"chicken",
                "cost":10,
                "event_id":1
              },
              {
                "id":12,
                "username":"Jack",
                "dish_id":12,
                "user_id":2,
                "name":"protein",
                "cost":1,
                "event_id":1
              }]'
            }]
          }]
        }
    */
