(function() {
  'use strict';

  angular.module('Piecemeal')
  .factory('oAuthFactory', oAuthFactory);

  oAuthFactory.$inject = ['$http'];

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
        });
    }
  }

})();
