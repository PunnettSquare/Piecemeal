(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  function homeFactory($http) {
    var services = {
      createEvent: createEvent,
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

    function createEvent(userObj) {
      return $http({
        method: 'POST',
        url: '/createEvent',
        data: userObj
      })
      .then(function(res) {
        return res.data // TODO look at where createEvent is called, and handle the data and page change with $location.path('newLocation')
      });
    }
  }

})();
