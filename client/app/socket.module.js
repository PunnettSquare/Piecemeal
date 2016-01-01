// # GuestBill Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Customized API over SocketIO to be integrated with Angular's digest cycle.

// To use sockets on client, inject 'socket' (and add to params) in all controllers that will use sockets (all except home)

// Adds sockets to the digest cycle the angular way:

(function() {
  'use strict';

  angular.module('Piecemeal')

  .factory('socketFactory', socketFactory);

  socketFactory.$inject = ['$rootScope', '$window'];

  // **Parameters:** TODO

  function socketFactory($rootScope, $window) {

    var socket;
    var services = {
      on: on,
      emit: emit,
      init: init
    };

    return services;

    function init() {
      var ioRoom = $window.location.origin + '/' + $window.localStorage.code;
      $window.socket = io(ioRoom);
    }

    function on(eventName, callback) {
      $window.socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply($window.socket, args);
        });
      });
    }

    function emit(eventName, data, callback) {
      $window.socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply($window.socket, args);
          }
        });
      });
    }
  }

})();
