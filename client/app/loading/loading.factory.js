(function() {
  'use strict';

  angular.module('PieceMeal')
    .factory('loadingFactory', loadingFactory);

  loadingFactory.$inject = [];

  function loadingFactory() {
    var services = {
      showLoading: showLoading
    };

    return services;

    function showLoading() {

    }
  }

})();
