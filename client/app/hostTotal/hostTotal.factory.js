(function() {
  'use strict';

  angular.module('PieceMeal')
    .factory('hostTotalFactory', hostTotalFactory);

  hostTotalFactory.$inject = [];

  function hostTotalFactory() {
    var services = {
      showHostTotal: showHostTotal
    };

    return services;

    function showHostTotal() {

    }
  }

})();
