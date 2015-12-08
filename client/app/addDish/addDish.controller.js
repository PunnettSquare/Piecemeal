(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'appFactory', '$location','addDishFactory'];

  function AddDishCtrl(socketFactory, appFactory, $location, addDishFactory) {
    var self = this;

    self.activate = function() {
      socketFactory.init();
      socketFactory.on('joined', function(data) {
        console.log("Joined Add Dish page, receiving data:", data);
      });
      self.calcUserCurrentTotal();
    };

    self.addDish = function(dish, cost) {
      console.log("Emitting dish", dish, "with cost", cost);
      socketFactory.emit('addDish', {
        cost: cost,
        name: dish,
        user_id: window.sessionStorage.user_id,
        event_id: window.sessionStorage.event_id
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
      self.userTotal = addDishFactory.calculateRunningTotal();
      console.log('self.userTotal =', self.userTotal);
    };

    self.activate();

  }

})();
