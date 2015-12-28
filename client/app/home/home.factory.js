(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  function homeFactory($http) {
    var services = {
      checkCode: checkCode
    };

    function checkCode(code) {
      return $http({
        method: 'GET',
        url: '/checkCode/' + code
      })
    }
    return services;
  }

})();
