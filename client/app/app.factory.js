// Sockets: client emits 'shareDish' to server, which broadcasts 'dishShared' to clients. hear it here and update data on service
// then, if the controllers have direct binding to this data, no further action is needed

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('appFactory', appFactory);

  appFactory.$inject = ['socketFactory', '$rootScope'];

  function appFactory(socketFactory, $rootScope) {

    var services = {
      initListeners: initListeners,
      addDish: addDish,
      shareDish: shareDish,
      unshareDish: unshareDish
    };

    return services;

    function addDish(dish) {
      for (var i = 0; i < services.data.users.length; i++) {
        if (services.data.users[i].id.toString() === dish.user_id) {
          services.data.users[i].dishes.push(dish);
        }
      }
      services.data.dishes.push(dish);
    }

    function shareDish(dish_id, user_id) {
      var dishObj;
      services.data.dishes.forEach(function(dish) {
        if (dish.dish_id === dish_id) {
          dish.users.push(user_id);
          dishObj = dish;
        }
      });
      services.data.users.forEach(function(user) {
        if (user.id.toString() === user_id) {
          user.dishes.push(dishObj);
        }
      });
    }

    function unshareDish(dish_id, user_id) {
      services.data.dishes.forEach(function(dish) {
        if (dish.dish_id === dish_id) {
          dish.users.splice(dish.users.indexOf(user_id), 1);
        }
      });
      services.data.users.forEach(function(user) {
        if (user.id.toString() === user_id) {
          var dishIndex = user.dishes.reduce(function(dishIndex, dish, index) {
            if (dishIndex || dishIndex === 0) {
              return dishIndex;
            }
            if (dish.dish_id === dish_id) {
              return index;
            }
          }, false);
          user.dishes.splice(dishIndex, 1);
        }
      });
    }

    function initListeners() {
      socketFactory.on('joined', function(data) {
        console.log("Heard 'joined' in appFactory.data: ", data);
        services.data = data;
        $rootScope.$broadcast('joined');
      });

      socketFactory.on('newParticipant', function(userObj) {
        services.data.users.push(userObj);
      });
      socketFactory.on('dishAdded', function(dish) {
        console.log("dishAdded data is: ", dish);
        addDish(dish);
      });

      socketFactory.on('dishShared', function(data) {
        console.log("heard 'dishShared' in appFactory. data: ", data);
        shareDish(data.dish_id, data.user_id);
      });

      socketFactory.on('dishUnshared', function(data) {
        console.log("heard 'dishUnshared' in appFactory. data: ", data);
        unshareDish(data.dish_id, data.user_id);
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
