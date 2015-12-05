(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', '$scope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, $scope) {

    var self = this;

    /* format of data:
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

    /* Future format of data:
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

    socketFactory.on('join', function(data) {
      console.log("----->Upon join, received this data: ", data);
      self.listOfDishes = data;
    });

    socketFactory.on('dishAdded', function(data) {
      self.listOfMeals.push(data);
    });

    socketFactory.init();

    socketFactory.on('join', function(data) {
      console.log("receiving data for join", data);
      self.socketmessage = "data: " + data;
      $scope.data = data;
    });

    // added this to test sockets across different views
    self.goToAddDish = function () {
      $location.path('/' + $window.location.toString().split('/')[4] + '/addDish');
    }

    allDishesFactory.getEventInfo();
    // end test
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

    // db queries
    // input: username + id + event
    // outputs:
    // list of dishes & costs
    // how many people sharing dish

    // socket broadcast
    // remove meal
    // share meal

    // global listener (already on app.socket.init)
    // any added dishes from other people (in real time)

    // calculate:
    // filter total list for user-only dishes
    //  calculate cost of each shared dish by dividing by # of people sharing it
    // your total bill
    // dinner party total bill (reduce total list cost)
  }
})();



