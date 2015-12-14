(function() {
	'use strict';

	angular.module('Piecemeal')
		.factory('allDishesFactory', allDishesFactory);

	allDishesFactory.$inject = ['$http', '$window'];

	function allDishesFactory($http, $window) {

		var services = {};

		return services;

	}
})();
