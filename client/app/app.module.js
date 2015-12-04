angular.module('Piecemeal', ['ui.router', 'ngMessages', 'btford.socket.io', 'Piecemeal.appCtrl'])

.factory('mySocket', function (socketFactory) {
  var mySocket = socketFactory();
  // mySocket.forward('error'); //could add this back in if error handling is necessary
  return mySocket;


}).controller('piecemealCtrl', function ($scope, socket) {

  // ** ------- Socket listeners ------- **

  // addUser:
  socket.forward('addUser', $scope);
  $scope.$on('socket:addUser', function (e, data) {
    // do something. e.g. $scope.data = data
  });

  // addHost?

  // addDish

  // removeDish

  // etc.

  // ** ------- Examples of Socket Emitters ------- **

  // Put these on other controllers and remove from here:

  // e.g. on click of add button, socket.emit('addUser')

});
