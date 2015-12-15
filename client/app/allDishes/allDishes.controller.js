(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', '$location', 'appFactory', '$scope', 'allDishesFactory'];

  function AllDishesCtrl(socketFactory, $location, appFactory, $scope, allDishesFactory) {
    var self = this;

    self.user_id = appFactory.getSessStorage('user_id');
    self.event_id = appFactory.getSessStorage('event_id');
    self.username = appFactory.getSessStorage('username');
    self.isHost = appFactory.getSessStorage('isHost');

    $scope.$on('joined', function() { // $on does not work with `self`
      self.data = appFactory.data;
      console.log("Joined the All Dishes room.");
    });

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
    }
    self.data = appFactory.data;

    self.getUsersByDish = appFactory.getUsersByDish;

    self.goToAllDishes = appFactory.goToAllDishes;
    self.goToGuestBill = appFactory.goToGuestBill;
    self.goToAddDish = appFactory.goToAddDish;
    self.goToHostBill = appFactory.goToHostBill;

    // self.getId = function(arrayOfIds, eventInfo) {
    //   var usernames = arrayOfIds.map(function(id) {
    //     var result;
    //     eventInfo.users.forEach(function(user) {
    //       if (user.id.toString() === id.toString()) {
    //         result = _.capitalize(user.username);
    //       }
    //     });
    //     if (result) {
    //       return result;
    //     }
    //   });
    //   return usernames.length === 1 ? usernames[0] : usernames.join(', ');
    // };

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
          user_id: user_id
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
