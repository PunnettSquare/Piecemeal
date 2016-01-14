// # OAuth Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('oAuthFactory', oAuthFactory);

  oAuthFactory.$inject = ['$http'];

  // **Parameters:** TODO

  function oAuthFactory($http) {
    var services = {
      createEvent: createEvent
    };

    return services;

    function createEvent(userObj) {
      return $http({
          method: 'POST',
          url: '/createEvent',
          data: userObj
        })
        .then(function(res) {
          return res.data;
        })
        .catch(function(err) {
          console.error(err);
        })
    }
  }

})();
