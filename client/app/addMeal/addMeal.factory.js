(function() {
	'use strict';

	angular.module('PieceMeal')
	.factory('addMealFactory', addMealFactory);

  addMealFactory.$inject = [];

	function addMealFactory() {
    var services = {
    	addMeal: addMeal
    };

    return services;

    function addMeal () {

    }
	}

})();
