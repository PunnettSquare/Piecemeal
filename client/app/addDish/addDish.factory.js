(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('addDishFactory', addDishFactory);

  addDishFactory.$inject = [];

  function addDishFactory() {
    var services = {
      calculateRunningTotal: calculateRunningTotal
    };

    return services;

    function calculateRunningTotal(data) {
      return _.filter(data.dishes, function(obj, key) {
          return _.contains(obj.users, parseInt(window.sessionStorage.user_id));
        })
        .reduce(function(acc, current) {
          return acc + (current.cost / current.users.length);
        }, 0);
    }
  }

})();
