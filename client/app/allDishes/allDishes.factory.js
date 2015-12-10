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

    function getEventInfo(user_id) {
      return $http({
          method: 'POST',
          url: '/' + window.sessionStorage.code,
          data: {user_id: user_id}
        })
    }
  }
})();
