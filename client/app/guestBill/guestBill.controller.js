(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = [];

  function GuestBillCtrl() {
    var self = this;


  }

})();




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
