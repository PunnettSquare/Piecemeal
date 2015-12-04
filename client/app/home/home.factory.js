(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('homeFactory', homeFactory);

  homeFactory.$inject = [];

  function homeFactory() {
    var services = {
      enterRoom: enterRoom
    };

    return services;

    function enterRoom() {

    }
  }

})();
