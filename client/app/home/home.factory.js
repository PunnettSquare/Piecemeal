(function() {
  'use strict';

  angular.module('PieceMeal')
    .factory('landingFactory', landingFactory);

  landingFactory.$inject = [];

  function landingFactory() {
    var services = {
      enterRoom: enterRoom
    };

    return services;

    function enterRoom() {

    }
  }

})();
