// Sockets: client emits 'shareDish' to server, which broadcasts 'dishShared' to clients. hear it here and update data on service
// then, if the controllers have direct binding to this data, no further action is needed

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('appFactory', appFactory);

  appFactory.$inject = ['socketFactory', '$rootScope'];

  function appFactory(socketFactory, $rootScope) {
    
    var services = {
      initListeners: initListeners
      /* data : {
        insert format here
      }*/
    };

    return services;

    function initListeners() {
      console.log("eventlisteners added");

      socketFactory.on('joined', function(data) {
        console.log("heard 'joined' in appFactory. data: ", data);
        services.data = data;
        console.log("services.data = ", services.data);
        $rootScope.$broadcast('joined');
      });

      socketFactory.on('dishAdded', function(data) {
        console.log("heard 'dishAdded' in appFactory" );
        console.log("dishAdded data is: ", data); // data format: {cost: 3, name: "rice", user_id: "29319", event_id: 1, users: ["29319"]}
        for (var i = 0; i < services.data.users.length; i++) {
          if (services.data.users[i].id == data.user_id) {
            services.data.users[i].dishes.push(data);
          }
        }
        services.data.dishes.push(data);
        // now, either pages will have two way data binding with the above data, OR will need to broadcast with scope
      });

      socketFactory.on('dishShared', function (data) {
        console.log("heard 'dishShared' in appFactory. data: ", data); // data format: {user_id: 24, dish_id: 14}
        services.data.dishes.forEach(function(dish) {
          if (dish.dish_id === data.dish_id) {
            dish.users.push(data.user_id);
          }
        });
      });

      socketFactory.on('dishUnshared', function (data) {
        console.log("heard 'dishUnshared' in appFactory. data: ", data); // data format: 
        services.data.dishes.forEach(function(dish) {
          if (dish.dish_id === data.dish_id) {
            dish.users.splice(dish.users.indexOf(data.user_id), 1);
          }
        });
      });

    }
  }

})();

// Temporarily keep old version of socket setup for reference:

// .controller('piecemealCtrl', function ($scope, socket) {

// ** ------- Socket listeners ------- **

// socket.forward('getDish', $scope);
// $scope.$on('socket:getDish', function (e, data) {
//   // do something. e.g. $scope.data = data
// });

// ** ------- Socket Emitters ------- **

// Put these on other controllers 
