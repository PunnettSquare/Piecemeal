(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = [];

  function AddDishCtrl() {
    var self = this;

    AppSocket.socket.emit('addDish', {
      cost: 324234,
      name: "yum"
    });

  }

})();
