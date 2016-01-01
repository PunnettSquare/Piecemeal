// # Home Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO


(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  // **Parameters:** TODO


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
