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
      // socketFactory.on('dishAdded', function(data) {
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



// Separating factories by purpose is best practice
// What is the proper way to organize multiple factories in the John Papa style?
// Sockets: client emits 'shareDish' to server, which broadcasts to clients. hear it here and update data on service
// then, if the controllers have direct binding to this data, no further action is needed
// if necessary, use $rootScope to setup broadcast and emit to controllers in the client. (not using sockets to do this, b/c sockets go back and forth to the server)

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('dataFactory', dataFactory);

  dataFactory.$inject = [$rootScope];

  function dataFactory($rootScope) {
    var services = {
      broadcastAddDish: broadcastAddDish
    };

    return services;





    function broadcastAddDish() {
      // socketFactory.on('dishAdded', function(data) {
        console.log("---->heard 'dishAdded' in dataFactory" ); 
        // return data;
      // });
      $rootScope.$broadcast('addDish');
    }
  }

})();

/* in allDishes
