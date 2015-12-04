(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('addDishFactory', addDishFactory);

  addDishFactory.$inject = [];

  function addDishFactory() {
    var services = {
      addDish: addDish
    };

    return services;

    function addDish() {

    }
  }

})();
