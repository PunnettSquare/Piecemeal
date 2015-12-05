(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('appFactory', appFactory);

  appFactory.$inject = [];

  function appFactory() {
    var services = {
      getAllDishData: getAllDishData
    };

    return services;

    function getAllDishData() {
      // AppSocket.socket.on('dishAdded', function(data) {
      // return data;
      // });
    }
  }

})();

// .controller('piecemealCtrl', function ($scope, socket) {

// ** ------- Socket listeners ------- **

// socket.forward('getDish', $scope);
// $scope.$on('socket:getDish', function (e, data) {
//   // do something. e.g. $scope.data = data
// });

// ** ------- Examples of Socket Emitters ------- **

// Put these on other controllers and remove from here:

// e.g. on click of add button, socket.emit('addUser')
