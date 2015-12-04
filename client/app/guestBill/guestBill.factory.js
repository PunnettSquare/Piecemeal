(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('guestBillFactory', guestBillFactory);

  guestBillFactory.$inject = [];

  function guestBillFactory() {
    var services = {
      showGuestBill: showGuestBill
    };

    return services;

    function showGuestBill() {

    }
  }

})();
