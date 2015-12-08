(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', '$scope', 'appFactory'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, $scope, appFactory) {

    var self = this;

    self.user_id = parseInt(window.sessionStorage.user_id);
    self.dishes = appFactory.dishes; //testing

    socketFactory.init();
    appFactory.initListeners();

    socketFactory.on('join', function(data) {
      console.log("receiving data for join", data);
      self.socketmessage = "data: " + data;
      $scope.data = data;
    });

    self.goToAddDish = function () {
      $location.path('/' + $window.location.toString().split('/')[4] + '/addDish');
    };

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
    };

    self.isOnDish = function(dish_id, user_id) {
      var result = false;
      $scope.data.dishes.forEach(function(dish) {
        if (dish.dish_id === dish_id) {
          dish.users.forEach(function(user) {
            if (user === user_id) {
              result = true;
            }
          });
        }
      });
      return result;
    };
    
    self.shareDish = function(dish_id, user_id) { //nclick must access dish_id** figure out how to provide these
      if (!self.isOnDish(dish_id, user_id)) {
        socketFactory.emit('shareDish', { // server needs .on(shareDish) that adds user to Dish
          dish_id: dish_id,
          user_id: user_id // ** ask Michelle how to get user from session
        });
        // update this dish's shared users in self.listOfDishes to include user
        $scope.data.dishes.forEach(function(dish) {
          if (dish.dish_id === dish_id) {
            dish.users.push(user_id);
          }
        })
      } 
    };

    self.unshareDish = function (dish_id, user_id) {
      if (self.isOnDish(dish_id, user_id)) {
        socketFactory.emit('unshareDish', { // server needs .on(unshareDish) that adds user to Dish
          dish_id: dish_id,
          user_id: user_id
        });

        // update this dish's shared users in self.listOfDishes to remove user
        $scope.data.dishes.forEach(function(dish) {
          if (dish.dish_id === dish_id) {
            dish.users.splice(dish.users.indexOf(user_id), 1);
          }
        })
      }
    };

    // For future floating active users feature:
    // socketFactory.on('addUser', function(data) {
    //   console.log("----->Upon new user joining, received this user data: ", data);
    //   self.listOfUsers.push = data;
    // });

  }
})();
