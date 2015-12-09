(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', 'appFactory', '$scope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, appFactory, $scope) {

    var self = this;

    self.user_id = window.sessionStorage.user_id;
    self.dishes = appFactory.dishes; //testing
    self.data = appFactory.data;
    socketFactory.init();
    if (!self.data) {
      appFactory.initListeners();
    }
    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope

    $scope.$on('joined', function() { //$on does not work with `self`
      self.data = appFactory.data;
      console.log("Joined the All Dishes room.");

      window.sessionStorage.setItem('event_id', self.data.event_id);
      if (appFactory.data.users.length === 1) {
        window.sessionStorage.setItem('user_id', self.data.users[0].id);
      }
    })

    self.goToAddDish = function() {
      $location.path('/' + window.sessionStorage.code + '/addDish');
    };

    allDishesFactory.getEventInfo(window.sessionStorage.getItem('user_id'));

    self.getId = function(arrayOfIds, eventInfo) {
      var usernames = arrayOfIds.map(function(id) {
        var result;
        eventInfo.users.forEach(function(user) {
          if (user.id.toString() === id.toString()) {
            result = user.username;
          }
        });
        if (result) {
          return result;
        }
      });
      return usernames.length === 1 ? usernames[0] : usernames.join(', ');
    };

    self.isOnDish = function(dishUsers, user_id) {
      var result = false;
      return dishUsers.reduce(function(isOnDish, id) {
        if (id.toString() === user_id.toString()) {
          return true;
        }
        return isOnDish;
      }, false);
    };

    self.shareDish = function(dish_id, user_id, users) {
      if (!self.isOnDish(users, user_id)) {
        socketFactory.emit('shareDish', {
          dish_id: dish_id,
        });
        appFactory.shareDish(dish_id, user_id);
      }
    };

    self.unshareDish = function(dish_id, user_id, users) {
      if (self.isOnDish(users, user_id)) {
        socketFactory.emit('unshareDish', {
          dish_id: dish_id,
          user_id: user_id
        });
        appFactory.unshareDish(dish_id, user_id);
      }
    };

  }
})();
