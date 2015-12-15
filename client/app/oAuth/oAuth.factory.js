(function() {
  'use strict';

  angular.module('Piecemeal')
  .factory('oAuthFactory', oAuthFactory);

  oAuthFactory.$inject = ['$http'];

  function oAuthFactory($http) {
    var services = {
      venmoLogin: venmoLogin,
    };

    return services;

    function venmoLogin() {
      // return $http({
      //     method: 'GET',
      //     url: '/auth/test',
      //   })
    }
  }

})();
