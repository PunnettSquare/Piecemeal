// # App Factory

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Store data and shared functionality (updating sessions, dishes, logging out, etc.) for quick access by controllers and initialize socket event listeners.

// Sockets: Client emits 'shareDish' (and other events) to server, which broadcasts 'dishShared' to clients. Socket event listeners in appFactory update the data in the factory. Then, if the controllers have direct binding to this data, no further action is needed


(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('appFactory', appFactory);

  appFactory.$inject = ['socketFactory', '$rootScope', '$window', '$location'];

  // **Parameters:**
  // ```socketFactory```: [Wrapper](../docs/socket.module.html) for SocketIO integrated with Angular's digest cycle
  // ```$rootScope```: Used to integrate into digest cycle
  // ```$window```: The socket is stored as a global variable on the window object
  // ```$location```: Makes the URL in the browser address bar (based on the window.location) editable

  function appFactory(socketFactory, $rootScope, $window, $location) {

    // **appFactory methods:**
    // .data and .data.billData are added subsequently

    var services = {
      initListeners: initListeners,
      addDish: addDish,
      shareDish: shareDish,
      unshareDish: unshareDish,
      getSessStorage: getSessStorage,
      arrayToSentence: arrayToSentence,
      getUsersByDish: getUsersByDish,
      getDishIndivCost: getDishIndivCost,
      goToAllDishes: goToAllDishes,
      goToGuestBill: goToGuestBill,
      goToAddDish: goToAddDish,
      goToHostBill: goToHostBill,
      goToHome: goToHome,
      copySessData: copySessData,
      logout: logout,
      checkCode: checkCode,
      calculateRunningTotal: calculateRunningTotal
    };

    return services;

    function checkCode() {
      if (!$window.localStorage.code || $window.location.hash.split("/")[1] !== $window.localStorage.code) {
        $location.path('/home');
      }
    }

    function getSessStorage(prop) {
      if (prop === "code") {
        return $window.localStorage.code;
      }
      if (prop === "event_id") {
        return parseInt($window.localStorage.event_id);
      }
      if (prop === "isHost") {
        return ($window.localStorage.isHost === "false") ? false : true;
      }
      if (prop === "user_id") {
        return parseInt($window.localStorage.user_id);
      }
      if (prop === "username") {
        return $window.localStorage.username;
      }
      if (prop === "billSent") {
        return ($window.localStorage.billSent === "true") ? true : false;
      }
    }

    function copySessData(self) {
      for (var prop in $window.localStorage) {
        self[prop] = getSessStorage(prop);
      }
    }

    function getDishIndivCost(dish) {
      var user_id = getSessStorage('user_id');
      // Calculate portions
      var count = 0;
      dish.users.forEach(function (userId) {
        if (userId == user_id) {
          count++
        }
      })
      return (dish.cost / dish.users.length) * count;
    }

    function calculateRunningTotal(data) {
      var user_id = getSessStorage('user_id');
      return (!data) ? 0 : _.filter(data.dishes, function(obj, key) {
          return _.contains(obj.users, user_id);
        })
        .reduce(function(totalSoFar, dish) {
          // Calculate portions per dish
          var count = 0;
          dish.users.forEach(function (userId) {
            if (userId == user_id) {
              count++
            }
          })
          // Then add together
          return totalSoFar + (Number(dish.cost) / dish.users.length) * count;
        }, 0);
    }

    function goToAddDish() {
      $location.path('/' + services.getSessStorage('code') + '/addDish');
    }

    function goToAllDishes() {
      $location.path('/' + services.getSessStorage('code') + '/allDishes');
    }

    function goToGuestBill() {
      $location.path('/' + services.getSessStorage('code') + '/guestBill');
    }

    function goToHostBill() {
      $location.path('/' + services.getSessStorage('code') + '/hostBill');
    }

    function goToHome() {
      $location.path('/home');
    }

    function addDish(dish) {
      for (var i = 0; i < services.data.users.length; i++) {
        if (services.data.users[i].id === dish.user_id) {
          services.data.users[i].dishes.push(dish);
        }
      }
      services.data.dishes.push(dish);
    }

    // Add user id to dish and dish to user
    function shareDish(dish_id, user_id, firstShare) {
      var dishObj;
      services.data.dishes.forEach(function(dish) {
        if (dish.dish_id === dish_id) {
          dish.users.push(user_id);
          dishObj = dish;
        }
      });
      if (firstShare) {
        services.data.users.forEach(function(user) {
          if (user.id === user_id) {
            user.dishes.push(dishObj);
          }
        });
      }
    }

    // Remove portion from dish and dish from user if last portion
    function unshareDish(dish_id, user_id) {
      // Flag as to if user has any portions left
      var last = true;
      services.data.dishes.forEach(function(dish, dishIndex) {
        if (dish.dish_id === dish_id) {
          var count;
          var lastIndex;

          // Check if user is on multiple times
          dish.users.forEach(function (userId, index) {
            if (userId === user_id) {
              count++;
              lastIndex = index;
            }
          })

          if (count > 1) {
            last = false;
          }

          // Remove one of them
          dish.users.splice(lastIndex, 1);

          // Remove dish entirely if this is last user on dish
          if (dish.users.length === 0) {
            services.data.dishes.splice(dishIndex, 1);
          }
        }
      });

      // If user has no portions left on dish, remove from user model
      if (last) {
        services.data.users.forEach(function(user) {
          if (user.id === user_id) {
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
    }

    // Delete everything stored in localStorage except for login info in order to leave the bill. Redirect to homepage. (Why 1 second wait?) (Rename as leaveBill?)
    function logout() {
      for (var prop in $window.localStorage) {
        if (prop !== 'username' && prop !== 'venmoUsername' && prop !== 'user_id') {
          delete $window.localStorage[prop];
        }
      }
      goToHome();
      setTimeout(function() {
        $window.location.reload();
      }, 1);
    }

    // Turn an array into sentence format with commas and "and"
    function arrayToSentence(array) {
      array = _.map(array, _.capitalize);
      if (array.length === 1) {
        return array[0];
      }
      if (array.length === 2) {
        return array.join(" and ");
      } else {
        var last = array.pop();
        return array.join(", ") + " and " + last;
      }
    }

    // Return list of users on a dish in sentence format
    function getUsersByDish(dish, users) {

      var tracker = {};

      _.each(dish.users, function (user_id) {
        if (tracker[user_id]) {
          tracker[user_id]++;
        } else {
          tracker[user_id] = 1;
        }
      });

      function findIndex(objArray, keyObj) {
        var result;
        objArray.forEach(function(obj, index) {
          for (var key in keyObj) {
            if (obj[key] == keyObj[key]) {
              result = index
            }
          }
        })
        return result;
      }

      var shares = _.map(tracker, function (portions, user_id) {
        if (portions > 1) {
          return users[findIndex(users, {
            'id': user_id
          })].username + ' (x' + portions + ')';
        } else {
          return users[findIndex(users, {
            'id': user_id
          })].username;
        }
      })

      return arrayToSentence(shares)

    }

    function initListeners() {
      // RootScope Broadcast: Upon refresh, controllers attempt to reference appFactory.data faster than the asynchronous get request to retrieve data, resulting in a reference to null. Therefore, to persist data on refresh, when the 'joined' event is emitted, a broadcast is sent out via the $rootScope message bus in order to let controllers know it is OK to retrieve a reference to appFactory.data.
      socketFactory.on('joined', function(data) {
        console.log("Heard 'joined' in appFactory.data:", data);
        services.data = data;
        $rootScope.$broadcast('joined');
      });

      socketFactory.on('newParticipant', function(userObj) {
        console.log("Heard 'newParticipant' in appFactory:", userObj);
        services.data.users.push(userObj);
      });

      socketFactory.on('dishAdded', function(dish) {
        console.log("Heard 'dishAdded' in appFactory.data:", dish);
        // data format: {cost: 3, name: "rice", user_id: "29319", event_id: 1, users: ["29319"]}
        addDish(dish);
      });

      socketFactory.on('dishShared', function(data) {
        console.log("Heard 'dishShared' in appFactory.data:", data);
        // data format: {user_id: 24, dish_id: 14}
        shareDish(data.dish_id, data.user_id, data.firstShare);
      });

      socketFactory.on('dishUnshared', function(data) {
        console.log("Heard 'dishUnshared' in appFactory.data:", data);
        unshareDish(data.dish_id, data.user_id);
      });

      socketFactory.on('billsSentToGuests', function(data) {
        console.log("Heard 'billsSentToGuests' in appFactory.data:", data);
        services.data.billData = data;

        $rootScope.$broadcast('billsSentToGuests');
      });

    }
  }
})();
