(function() {
  'use strict';

  angular.module('PieceMeal')
    .factory('hostCurrentBillFactory', hostCurrentBillFactory);

  hostCurrentBillFactory.$inject = [];

  function hostCurrentBillFactory() {
    var services = {
      showCurrentBill: showCurrentBill
    };

    return services;

    function showCurrentBill() {

    }
  }

})();
