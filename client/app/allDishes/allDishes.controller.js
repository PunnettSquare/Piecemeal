(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'appFactory', '$scope'];

  function AllDishesCtrl(socketFactory, appFactory, $scope) {
    var self = this;

    self.data = appFactory.data;

    appFactory.copySessData(self);
    self.getUsersByDish = appFactory.getUsersByDish;
    self.logout = appFactory.logout;

    $scope.$on('joined', function() {
      self.data = appFactory.data;
      console.log("Joined the All Dishes room.");
    });

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
      self.data = appFactory.data;
    }

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
