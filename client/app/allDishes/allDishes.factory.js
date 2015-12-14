(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('allDishesFactory', allDishesFactory);

  allDishesFactory.$inject = ['$http', '$window'];

  function allDishesFactory($http, $window) {

    var services = {
      connect: connect
    };

    function connect() {
      $http({
        method: 'POST',
        url: '/' + window.sessionStorage.code,
        data: {
          user_id: parseInt(window.sessionStorage.user_id)
        }
      });
    }

    return services;

  }
})();
