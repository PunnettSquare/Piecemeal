(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', '$scope', '$rootScope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, $scope, $rootScope) {

    var self = this;
    self.listOfDishes = []; // dishes and users per dish
    self.yourTotal = 0;
    self.groupTotal = 0;
    self.listOfUsers = []; // FUTURE feature, for having floating active users

    socketFactory.init();

    // window.sessionStorage should have: username, user_id, event code, event_id, and isHost, i.e.:
    // {code: "PHmBlkxjACGOECgHae2ux8AkapXyVp0s", event_id: "10", isHost: "true", user_id: "10", username: "asdf"}
    socketFactory.on('join', function(data) {
      console.log("Receiving all event info data & attaching to rootScope", data);
      window.sessionStorage.setItem('event_id', data.event_id);
      $rootScope.data = data;
      if (data.users.length === 1) {
        window.sessionStorage.setItem('user_id', data.user_id);
      }
    });

    socketFactory.on('dishAdded', function(data) {
      self.listOfMeals.push(data);
    });

    self.goToAddDish = function() {
      $location.path('/' + window.sessionStorage.code + '/addDish');
    };

    allDishesFactory.getEventInfo();

    $scope.getId = function(arrayOfIds, eventInfo) {
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
      });
      return usernames.length === 1 ? usernames[0] : usernames.join(', ');
    };

    self.shareDish = function(dish_id, user_id) { //nclick must access dish_id** figure out how to provide these
      socketFactory.emit('shareDish', { // server needs .on(shareDish) that adds user to Dish
        dish_id: dish_id,
        user_id: user_id // ** ask Michelle how to get user from session
      });
      // update this dish's shared users in self.listOfDishes to include user
      // update self.groupTotal
    };

    self.unshareDish = function(dish_id, user_id) {
      socketFactory.emit('unshareDish', { // server needs .on(unshareDish) that adds user to Dish
        dish_id: dish_id,
        user_id: user_id
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
