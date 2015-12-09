(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'addDishFactory', '$location', 'appFactory', '$scope'];

  function AddDishCtrl(socketFactory, addDishFactory, $location, appFactory, $scope) {
    var self = this;

    // socketFactory.init();
    // appFactory.initListeners();

    // When appFactory is updated, $rootScope is used as a bus to emit to user's allDishes controller $scope
    self.data = appFactory.data;

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };

    self.addDish = function(name, cost) {
      console.log("Emitting dish", name, "with cost", cost);
      var dish = {
        cost: cost,
        name: name,
        user_id: window.sessionStorage.user_id,
        event_id: window.sessionStorage.event_id,
        users: [window.sessionStorage.user_id]
      };
      socketFactory.emit('addDish', dish);
      appFactory.addDish(dish);
      self.amount = 0;
      self.dishName = '';
      // PROBLEM: When dish is added, "your total so far" is not automatically updated. Can be fixed via:
      // - fix sockets so data is updated real time, rather than attaching to a static self.data
      // - can continuously add to self.userTotal, but we should *really* avoid this because if someone decides to share the dish then our calculation will be out of date (especially if someone clicks share while the other person is still on addDish page - we want the numbers to update themselves automatically)
    };

    self.calcUserCurrentTotal = function(data) {
      self.userTotal = addDishFactory.calculateRunningTotal(data);
    };
    self.calcUserCurrentTotal(self.data);
  }

})();
