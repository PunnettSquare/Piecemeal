(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('hostReceiptFactory', hostReceiptFactory);

  hostReceiptFactory.$inject = [];

  function hostReceiptFactory() {
    var services = {
      showHostReceipt: showHostReceipt
    };

    return services;

    function showHostReceipt() {

    }
  }

})();
