(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', '$location', '$rootScope'];

  function AddDishCtrl(socketFactory, $location, $rootScope) {
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
        name: dish
      });
      self.amount = 0;
      self.dishName = '';
    };

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.calcUserCurrentTotal = function() {
      self.userTotal = _.filter($rootScope.data.users, 'username', window.sessionStorage.username)[0].dishes.reduce(function(acc, current) {
        return acc + (current.cost / current.users.length);
      }, 0);
      console.log('self.userTotal =', self.userTotal);
    };

    self.activate();


    // db queries
    // input: username + id + event
    // outputs:
    // list of dishes & costs
    // how many people sharing dish

    // socket broadcast
    // remove meal
    // share meal

    // global listener (already on app.socket.init)
    // any added dishes from other people (in real time)

    // calculate:
    // filter total list for user-only dishes
    //   calculate cost of each shared dish by dividing by # of people sharing it
    //      your total bill
    // dinner party total bill (reduce total list cost)

  }

})();
