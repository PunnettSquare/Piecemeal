(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'appFactory', '$rootScope', '$location',];

  function AddDishCtrl(socketFactory, appFactory, $rootScope, $location) {
    var self = this;

    self.activate = function() {
      socketFactory.init();
      socketFactory.on('join', function(data) {
        console.log("Joined Add Dish page, receiving data:", data);
      });
      self.calcUserCurrentTotal();
    };

    self.addDish = function(dish, cost) {
      console.log("Emitting dish", dish, "with cost", cost);
      socketFactory.emit('addDish', {
        cost: cost,
        name: dish,
        user_id: window.sessionStorage.user_id
      });
      self.amount = 0;
      self.dishName = '';
    };

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };

    self.calcUserCurrentTotal = function() {
      console.log('$rootScope =', $rootScope);
      self.userTotal = _.filter($rootScope.data.users, 'username', window.sessionStorage.username)[0].dishes
        .filter(function(value, key) {
          return _.isNumber(value.dish_id);
        })
        .reduce(function(acc, current) {
          console.log('current =', current);
          var numShared = (current.users) ? current.users.length : 1;
          return acc + (current.cost / numShared);
        }, 0);
      console.log('self.userTotal =', self.userTotal);
    };

    self.activate();

  }

})();
