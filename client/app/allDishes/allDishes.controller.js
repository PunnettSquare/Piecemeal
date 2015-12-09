(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', 'appFactory', '$rootScope', '$scope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, appFactory, $rootScope, $scope) {

    var self = this;

    self.user_id = parseInt(window.sessionStorage.user_id);
    self.dishes = appFactory.dishes; //testing

    socketFactory.init();
    appFactory.initListeners();

    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope
    self.data = "";
    $scope.$on('joined', function () { //$on does not work with `self`
      self.data = appFactory.data;
      console.log('AllDishesCtrl self.data = ', self.data);
      // window.sessionStorage should have: username, user_id, event code, event_id, and isHost, i.e.:
      // {code: "PHmBlkxjACGOECgHae2ux8AkapXyVp0s", event_id: "10", isHost: "true", user_id: "10", username: "asdf"}
      window.sessionStorage.setItem('event_id', self.data.event_id);
      if (appFactory.data.users.length === 1) {
        window.sessionStorage.setItem('user_id', self.data.users[0].id);
      }
    });

    self.goToAddDish = function() {
      $location.path('/' + window.sessionStorage.code + '/addDish');
    };

    allDishesFactory.getEventInfo();

    self.getId = function(arrayOfIds, eventInfo) {
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

    self.isOnDish = function(dish_id, user_id) {
      var result = false;
      self.data.dishes.forEach(function(dish) {
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

    self.shareDish = function(dish_id, user_id) {
      if (!self.isOnDish(dish_id, user_id)) {
        socketFactory.emit('shareDish', { // server needs .on(shareDish) that adds user to Dish
          dish_id: dish_id,
          user_id: user_id // ** ask Michelle how to get user from session
        });

        // Below code is in the process of being moved to appFactory

        // self.data.dishes.forEach(function(dish) { 
        //   if (dish.dish_id === dish_id) {
        //     dish.users.push(user_id);
        //   }
        // });
      }
    };

    self.unshareDish = function(dish_id, user_id) {
      if (self.isOnDish(dish_id, user_id)) {
        socketFactory.emit('unshareDish', { // server needs .on(unshareDish) that adds user to Dish
          dish_id: dish_id,
          user_id: user_id
        });

        // Below code is in the process of being moved to appFactory

        // self.data.dishes.forEach(function(dish) {
        //   if (dish.dish_id === dish_id) {
        //     dish.users.splice(dish.users.indexOf(user_id), 1);
        //   }
        // });
      }
    };

  }
})();
