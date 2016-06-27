// # Socket Module

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Custom SocketIO API integrated with Angular's digest cycle in a factory.

// To use sockets on client, inject 'socketFactory' (and add to params) in all controllers that will use sockets (all except home).

// Adds sockets to the digest cycle the angular way:

(function() {
  'use strict';

  angular.module('Piecemeal')

  .factory('socketFactory', socketFactory);

  socketFactory.$inject = ['$rootScope', '$window'];

  // **Parameters:**
  // ```$rootScope```: Used to integrate into digest cycle
  // ```$window```: The socket is stored as a global variable on the window object

  function socketFactory($rootScope, $window) {

    var socket;
    var services = {
      on: on,
      emit: emit,
      init: init
    };

    return services;

    var isActive = true;
    function init() {
      var ioRoom = $window.location.origin + '/' + $window.localStorage.code;
      $window.socket = io(ioRoom);

      on('ping', function() {
        isActive = true;
        emit('pong');
      });

      setInterval(function() {
        if (!isActive) {
          $window.socket = io(ioRoom, {
            reconnectionDelayMax: 0,
            timeout: 600000
          });
        } else {
          isActive = false;
        }
      }, 3000)
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
