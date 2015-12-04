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

// });
