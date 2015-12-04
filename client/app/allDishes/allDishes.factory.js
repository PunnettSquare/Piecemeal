(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('allDishesFactory', allDishesFactory);

  allDishesFactory.$inject = [];

  function allDishesFactory() {

    var services = {
      showDishes: showDishes
    };

    return services;

    function showDishes() {

    }

    // Example of how socketIO factory functions looks like
    // function on(eventName, callback) {
    //   socket.on(eventName, function() {
    //     var args = arguments;
    //     $rootScope.$apply(function() {
    //       callback.apply(socket, args);
    //     });
    //   });
    // }

    // function emit(eventName, data, callback) {
    //   socket.emit(eventName, data, function() {
    //     var args = arguments;
    //     $rootScope.$apply(function() {
    //       if (callback) {
    //         callback.apply(socket, args);
    //       }
    //     });
    //   });
    // }
  }

})();
