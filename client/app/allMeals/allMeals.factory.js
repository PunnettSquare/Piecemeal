(function() {
  'use strict';

  angular.module('PieceMeal')
    .factory('allMealsFactory', allMealsFactory);

  allMealsFactory.$inject = [];

  function allMealsFactory() {
    var services = {
      showMeals: showMeals
    };

    return services;

    function showMeals() {

    }
  }

})();
