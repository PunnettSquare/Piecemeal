// # Dashboard Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO


(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('dashboardFactory', dashboardFactory);

  dashboardFactory.$inject = ['$http'];

  // **Parameters:** TODO

  function dashboardFactory($http) {
    var services = {
      getBills: getBills,
      createEvent: createEvent
    };

    return services;

    function createEvent() {
      return $http({
        method: 'GET',
        url: '/auth/createEvent'
      });
    }

    function getBills() {
      return $http({
        method: 'GET',
        url: '/auth/getBills'
      });
    }
  }

})();
