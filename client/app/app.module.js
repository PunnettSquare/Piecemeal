angular.module('Piecemeal', ['ui.router', 'ngMessages', 'btford.socket-io'])


// johnpapa style?
.factory('mySocket', function (socketFactory) {
  var socket = socketFactory();
  // socket.forward('error'); //could add this back in if error handling is necessary
  return socket;


});

// .controller('piecemealCtrl', function ($scope, socket) {

  // ** ------- Socket listeners ------- **

  // socket.forward('getDish', $scope);
  // $scope.$on('socket:getDish', function (e, data) {
  //   // do something. e.g. $scope.data = data
  // });

  // ** ------- Examples of Socket Emitters ------- **

  // Put these on other controllers and remove from here:

  // e.g. on click of add button, socket.emit('addUser')

//   .factory('socket', function ($rootScope) {
//   var socket = io.connect();
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     }
//   };
// });
