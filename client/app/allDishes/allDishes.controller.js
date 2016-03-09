// # AllDishes Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Add, share, and remove dishes.

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'appFactory', '$scope', 'allDishesFactory', '$window', '$location'];

  // **Parameters:**
  // ```socketFactory```: [Wrapper](../docs/socket.module.html) for SocketIO integrated with Angular's digest cycle
  // ```appFactory```: [App-level methods](../docs/app.factory.html)
  // ```$scope```: The controller's local scope
  // ```allDishesFactory```: [Factory methods](../docs/allDishes.factory.html)

  function AllDishesCtrl(socketFactory, appFactory, $scope, allDishesFactory, $window, $location) {
    var self = this;

    // Copy data from ```window.localStorage``` onto the $scope.
    appFactory.copySessData(self);
    self.checkCode = appFactory.checkCode;
    var url = $window.location.hash;
    if (url === '' && $window.localStorage.code) {
      $location.path('/' + $window.localStorage.code + '/allDishes');
    }

    // **Assign appFactory data to scope, upon hearing 'joined' emitted by $rootScope.**

    // Copy the data emitted by appFactory through ```$rootScope```, upon hearing a 'joined' event, thus ensuring the latest data is on the scope.
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      console.log("Joined the All Dishes room.");

      // Calculate user's running total.
      self.calcUserCurrentTotal(self.data);
    });

    // Update scope's data with the most updated data from appFactory.
    // *(This is for when a page has NOT refreshed.)
    self.data = appFactory.data;

    // **Initialize [appFactory](../docs/app.factory.js) and [socketFactory](../docs/socket.module.html) socket listeners.**

    // ```appFactory.data``` will be undefined on a refresh and on the initial join, because AllDishesCtrl will have loaded before the socket connection is made with the server.

    if (!appFactory.data) {
      // This initializes the socket listeners on appFactory and sets up Angular's event system listeners.
      socketFactory.init();
      appFactory.initListeners();
    }

    // **Adding, Removing, Sharing Dishes**

    // Get list of user ID's through dish item.
    self.getUsersByDish = appFactory.getUsersByDish;

    // Check if the user has eaten the dish.
    self.isOnDish = function(dishUsers, user_id) {
      return dishUsers.reduce(function(isOnDish, id) {
        if (id.toString() === user_id.toString()) {
          return true;
        }
        return isOnDish;
      }, false);
    };

    // Add user's ID to dish item in appFactory, and send to the [server](../docs/sockets.js) through a socket event to update the database
    self.shareDish = function(dish_id, user_id, users) {
      if (!self.isOnDish(users, user_id)) {
        socketFactory.emit('shareDish', {
          dish_id: dish_id,
          user_id: user_id
        });
        appFactory.shareDish(dish_id, user_id);
      }
    };

    // Remove user's ID to dish item in appFactory, and send to the [server](../docs/sockets.js) through a socket event to update the database.
    self.unshareDish = function(dish_id, user_id, users) {
      if (self.isOnDish(users, user_id)) {
        socketFactory.emit('unshareDish', {
          dish_id: dish_id,
          user_id: user_id
        });
        appFactory.unshareDish(dish_id, user_id);
      }
    };

    // ## Add Dish Modal

    // Initialize modal's properties and functionality.
    $('.modal-trigger').leanModal({
      opacity: 0.7,
      in_duration: 230,
      out_duration: 230,
      calcUserCurrentTotal: self.calcUserCurrentTotal
    });

    // Calculate the user's running total bill.
    self.calcUserCurrentTotal = function(data) {
      return (!data) ? 0 : appFactory.calculateRunningTotal(data);
    };

    // Add dish item in appFactory, and send dish item data to the [server](../docs/sockets.js) through a socket event to update the database.
    self.addDish = function(name, cost) {
      var dish = {
        cost: Number(cost),
        name: name,
        user_id: self.user_id,
        event_id: self.event_id,
        users: [self.user_id]
      };
      socketFactory.emit('addDish', dish);
      self.amount = '';
      self.dishName = '';
      self.addedDish = true;
      self.previousDish = name;
    };

  }
})();
