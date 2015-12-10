(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'addDishFactory', '$location', 'appFactory', '$scope'];

  function AddDishCtrl(socketFactory, addDishFactory, $location, appFactory, $scope) {
    var self = this;

    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope
    self.data = appFactory.data;

    self.addDish = function(name, cost) {
      var dish = {
        cost: cost,
        name: name,
        user_id: window.sessionStorage.user_id,
        event_id: window.sessionStorage.event_id,
        users: [window.sessionStorage.user_id]
      };
      socketFactory.emit('addDish', dish);
      appFactory.addDish(dish);
      self.userTotal += cost;
      self.amount = 0;
      self.dishName = '';
    };

    self.calcUserCurrentTotal = function(data) {
      self.userTotal = addDishFactory.calculateRunningTotal(data);
    };

    self.calcUserCurrentTotal(self.data);

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };
  }

})();
