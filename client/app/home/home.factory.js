(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  function homeFactory($http) {
    var services = {
      checkCode: checkCode,
      createEvent: createEvent
    };

    function checkCode(code) {
      return $http({
        method: 'GET',
        url: '/checkCode/' + code
      })
    }

    function createEvent(data) {
      return $http({
        method: 'POST',
        url: '/auth/createEvent',
        data: data
      });
    }

    return services;
  }

})();
