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
          data: username // user id, possibly username
        })
        .then(function(res) {
          return res.data;
        });
    }

    function createEvent() {
      return $http({
        method: 'POST',
        url: '/createEvent',
        data: {username: username}
      })
      .then(function(res) {
        console.log('res.data =', res.data);
        return res.data // nothing -> redirect from socket
      });
    }
  }

})();
