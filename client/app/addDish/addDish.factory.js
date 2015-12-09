(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('addDishFactory', addDishFactory);

  addDishFactory.$inject = ['$rootScope'];

  function addDishFactory($rootScope) {
    var services = {
      calculateRunningTotal: calculateRunningTotal
    };

    return services;

    function calculateRunningTotal() {
      return _.filter($rootScope.data.dishes, function(obj, key) {
          return _.contains(obj.users, parseInt(window.sessionStorage.user_id));
        })
        .reduce(function(acc, current) {
          return acc + (current.cost / current.users.length);
        }, 0);
    }
  }

})();
