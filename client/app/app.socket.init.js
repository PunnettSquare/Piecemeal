var AppSocket = {};

AppSocket.init = function() {
  var ioRoom = window.location.href;
  AppSocket.socket = io(ioRoom);

  // Add listeners!

};

AppSocket.init();
