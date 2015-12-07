(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('allDishesFactory', allDishesFactory);

  allDishesFactory.$inject = ['$http', '$window'];

  function allDishesFactory($http, $window) {

    var services = {
      // showDishes: showDishes,
      getEventInfo: getEventInfo
    };

    return services;

    function getEventInfo(username) {
      return $http({
          method: 'GET',
          url: '/' + $window.location.toString().split('/')[4],
          data: username // user id, possibly username
        })
        .then(function(res) {
          return res.data;
        });
    }
  }
})();
