// # AllDishes Factory

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Calculate the running total in the add Dish modal.

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('allDishesFactory', allDishesFactory);

  allDishesFactory.$inject = ['appFactory'];

  // **Parameters:** TODO

  function allDishesFactory(appFactory) {

    var services = {
      calculateRunningTotal: calculateRunningTotal
    };

    return services;

    function calculateRunningTotal(data) {
      return (!data) ? 0 : _.filter(data.dishes, function(obj, key) {
          return _.contains(obj.users, appFactory.getSessStorage('user_id'));
        })
        .reduce(function(acc, current) {
          return acc + (Number(current.cost) / current.users.length);
        }, 0);
    }

  }
})();
