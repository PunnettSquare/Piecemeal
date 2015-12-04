angular.module('Piecemeal', ['ui.router', 'ngMessages', 'btford.socket-io'])
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
