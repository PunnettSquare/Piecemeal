// To use sockets on client, inject 'socket' (and add to params) in all controllers that will use sockets (all except home)

// Adds sockets to the digest cycle the angular way:
(function() {
  'use strict';

  angular.module('Piecemeal')

  .factory('socket', socketFn);

  socketFn.$inject = ['$rootScope', '$window'];

  function socketFn ($rootScope, $window) {

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
  }

})();


// NON-JOHN PAPA STYLE, BUT FUNCTIONAL:
// Note: requires adding 'socket' to Piecemeal's dependencies
// Keeping this temporarily in case it makes testing complicated bugs easier

// angular.module('socket', [])

// .factory('socket', function ($rootScope, $window) {
//   // Connect to sockets.io with unique ioRoom ID
//   var ioRoom = $window.location.href;
//   var socket = io(ioRoom);
//   console.log('Joining ioRoom: ', ioRoom);

  // return {
  //   on: function (eventName, callback) {
  //     socket.on(eventName, function () {
  //       var args = arguments;
  //       $rootScope.$apply(function () {
  //         callback.apply(socket, args);
  //       });
  //     });
  //   },
  //   emit: function (eventName, data, callback) {
  //     socket.emit(eventName, data, function () {
  //       var args = arguments;
  //       $rootScope.$apply(function () {
  //         if (callback) {
  //           callback.apply(socket, args);
  //         }
  //       });
  //     });
  //   }
  // };

// });
