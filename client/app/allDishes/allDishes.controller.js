(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', '$location', 'appFactory', '$scope'];

  function AllDishesCtrl(socketFactory, $location, appFactory, $scope) {
    var self = this;

    self.user_id = appFactory.getSessStorage('user_id');
    self.event_id = appFactory.getSessStorage('event_id');
    self.username = appFactory.getSessStorage('username');

    self.data = appFactory.data;

    socketFactory.init();
    if (!self.data) {
      appFactory.initListeners();
    }
    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope
    $scope.$on('joined', function() { // $on does not work with `self`
      self.data = appFactory.data;
      console.log("Joined the All Dishes room.");
    });

    self.getUsersByDish = appFactory.getUsersByDish;

    self.goToAddDish = function() {
      $location.path('/' + window.sessionStorage.code + '/addDish');
    };

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

    // Depends on the appFactory.data refactor
    // self.getDishes = function(data) {
    //   self.allDishes = _.each(data.dishes,
    //     function(obj, key) {
    //       obj.indivCost = obj.cost / obj.users.length;
    //       obj.isShared = (obj.users.length === 1) ? false : true;
    //       obj.users = _.map(obj.users, function(id) {
    //         var index = _.findIndex(data.users, {
    //           'id': id
    //         });
    //         return {
    //           username: data.users[index].username,
    //           user_id: data.users[index].id,
    //           isHost: data.users[index].host
    //         };
    //       });
    //     });
    // };

  }
})();
