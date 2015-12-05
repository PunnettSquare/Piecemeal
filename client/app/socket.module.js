// JOHN PAPA REFACTOR IN PROGRESS

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


// NON-JOHN PAPA STYLE, BUT FUNCTIONAL:

// inject 'socket' (and add to params) in all controllers that will use sockets (all except home)
// adds sockets to the digest cycle the angular way:

angular.module('socket', [])

.factory('socket', function ($rootScope, $window) {
  // Connect to sockets.io with unique ioRoom ID
  var ioRoom = $window.location.href;
  var socket = io(ioRoom);
  console.log('Joining ioRoom: ', ioRoom);

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
