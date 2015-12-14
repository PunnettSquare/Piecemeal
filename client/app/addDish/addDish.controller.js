(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'addDishFactory', '$location', 'appFactory', '$scope'];

  function AddDishCtrl(socketFactory, addDishFactory, $location, appFactory, $scope) {
    var self = this;
    self.test = "test";
    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope
    self.data = appFactory.data;

    self.addDish = function(name, cost) {

      var dish = {
        cost: Number(cost),
        name: name,
        user_id: appFactory.getSessStorage('user_id'),
        event_id: appFactory.getSessStorage('event_id'),
        users: [appFactory.getSessStorage('user_id')]
      };
      socketFactory.emit('addDish', dish);
      self.userTotal += cost;
      self.amount = 0;
      self.dishName = '';
    };

    self.calcUserCurrentTotal = function(data) {
      self.userTotal = addDishFactory.calculateRunningTotal(data);
    };
    
    self.calcUserCurrentTotal(self.data);

    self.goToAllDishes = function() {
      $location.path('/' + appFactory.getSessStorage('code') + '/allDishes');
    };

    self.goToGuestBill = function() {
      $location.path('/' + appFactory.getSessStorage('code') + '/guestBill');
    };
  }

})();
