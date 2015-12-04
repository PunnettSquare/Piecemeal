var AppSocket = {};

AppSocket.init = function() {
  var ioRoom = window.location.href;
  AppSocket.socket = io(ioRoom);

  // Add listeners!
  AppSocket.socket.on('dishAdded', function(data) {
    console.log('Broadcasted data =', data);
  });
};

AppSocket.init();


// .controller('piecemealCtrl', function ($scope, socket) {

// ** ------- Socket listeners ------- **

// socket.forward('getDish', $scope);
// $scope.$on('socket:getDish', function (e, data) {
//   // do something. e.g. $scope.data = data
// });

// ** ------- Examples of Socket Emitters ------- **

// Put these on other controllers and remove from here:

// e.g. on click of add button, socket.emit('addUser')
