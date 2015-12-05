// (function() {
//   'use strict';

//   angular.module('socket')
//     .factory('socket', socket);

//   socket.$inject = [];

//   var ioRoom = $window.location.href;
//   var socketRoom = io(ioRoom);
//   console.log('Joining ioRoom: ', ioRoom);

//   function socket () {
//     return socketRoom;
//   }

// })();

// note to self: refactor the john papa way (test in home temporarily), then fix ui-router
// inject 'socket' (and add to params) in all controllers that will use sockets (all except home)
angular.module('socket', [])

.factory('socket', function ($rootScope, $window) {
  // Connect to sockets.io with unique ioRoom ID
  var ioRoom = $window.location.href;
  var socket = io(ioRoom);
  console.log('Joining ioRoom: ', ioRoom);

  // return socket;

  // Since socket is now in a factory, we'll need to use $apply on the scope
  // Instead, we will use $apply on the scope, this allows us to 
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };

});
