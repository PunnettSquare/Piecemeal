(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'appFactory'];

  function AddDishCtrl(socketFactory, appFactory) {
    var self = this;


    self.addDish = function(dish, cost) {
      console.log('dish, cost =', dish, cost);
      socketFactory.emit('addDish', {
        cost: cost,
        name: dish,
        user_id: window.sessionStorage.user_id
      });
      self.amount = 0;
      self.dishName = '';
    };

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
