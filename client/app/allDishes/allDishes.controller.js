(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory'];

  function AllDishesCtrl(socketFactory) {
    var self = this;
    self.listOfMeals;

    socketFactory.on('join', function(data) {
      console.log("receiving data for join", data);
      self.socketmessage = "data: " + data;
    });
    // end test


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
    //  calculate cost of each shared dish by dividing by # of people sharing it
    // your total bill
    // dinner party total bill (reduce total list cost)
  }
})();


// join
// socketFactory.on('join', function(data) {
//   self.listOfMeals = data;
// });

// socketFactory.on('dishAdded', function(data) {
//   self.listOfMeals.push(data);
// });
