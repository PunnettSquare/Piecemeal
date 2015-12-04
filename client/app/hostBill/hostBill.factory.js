(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('hostBillFactory', hostBillFactory);

  hostBillFactory.$inject = [];

  function hostBillFactory() {
    var services = {
      showHostBill: showHostBill
    };

    return services;

    function showHostBill() {

    }
  }

})();
