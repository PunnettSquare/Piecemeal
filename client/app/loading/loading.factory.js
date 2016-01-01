(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('loadingFactory', loadingFactory);

  loadingFactory.$inject = ['$http'];

  function loadingFactory($http) {
    var services = {
      sendSessionUser: sendSessionUser
    };

    return services;

    function sendSessionUser(username) {
      return $http({
          method: 'POST',
          url: '/newUser',
          data: username
        })
        .then(function(res) {
          return res.data;
        })
        .catch(function(err) {
          throw err;
        });
    }
  }

})();
