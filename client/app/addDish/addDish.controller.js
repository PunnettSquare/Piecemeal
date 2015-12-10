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

    self.addDish = function(name, cost) {
      console.log("Emitting dish", name, "with cost", cost);
      console.log('window.sess =', window.sessionStorage.user_id);
      var dish = {
        cost: cost,
        name: name,
        user_id: window.sessionStorage.user_id,
        event_id: window.sessionStorage.event_id,
        users: [window.sessionStorage.user_id]
      }
      socketFactory.emit('addDish', dish);
      console.log(appFactory.addDish)
      appFactory.addDish(dish);
      self.amount = 0;
      self.dishName = '';
      // PROBLEM: When dish is added, "your total so far" is not automatically updated. Can be fixed via:
      // - fix sockets so data is updated real time, rather than attaching to a static self.data
      // - can continuously add to self.userTotal, but we should *really* avoid this because if someone decides to share the dish then our calculation will be out of date (especially if someone clicks share while the other person is still on addDish page - we want the numbers to update themselves automatically)
    };

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };

    self.calcUserCurrentTotal = function() {
      // self.userTotal = addDishFactory.calculateRunningTotal();
      // console.log('self.userTotal =', self.userTotal);
    };

    self.activate();

  }

})();
