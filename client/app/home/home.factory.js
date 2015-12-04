(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  function homeFactory($http) {
    var services = {
      enterRoom: enterRoom,
      sendSessionUser: sendSessionUser
    };

    return services;

    function enterRoom() {

    }

    function sendSessionUser(username) {
      return $http({
          method: 'POST',
          url: '/newUser',
          data: username
        })
        .then(function(res) {
          return res.data;
        });
    }
  }

})();
