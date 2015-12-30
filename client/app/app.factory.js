// Sockets: client emits 'shareDish' to server, which broadcasts 'dishShared' to clients. hear it here and update data on service
// then, if the controllers have direct binding to this data, no further action is needed

(function() {
  'use strict';

  angular.module('Piecemeal')
    .factory('appFactory', appFactory);

  appFactory.$inject = ['socketFactory', '$rootScope', '$window', '$location'];

  function appFactory(socketFactory, $rootScope, $window, $location) {

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
      // getUsers: getUsers
      // data: data
      // data.billData: billData
    };

    return services;

    // function getUsers() {
    //   console.log("services data: ", services.data);
    //   // Work in progress potentially for host Receipt
    // };

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
      return dish.cost / dish.users.length;
    }

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

    function shareDish(dish_id, user_id) {
      var dishObj;
      services.data.dishes.forEach(function(dish) {
        if (dish.dish_id === dish_id) {
          dish.users.push(user_id);
          dishObj = dish;
        }
      });
      services.data.users.forEach(function(user) {
        if (user.id === user_id) {
          user.dishes.push(dishObj);
        }
      });
    }

    function unshareDish(dish_id, user_id) {
      services.data.dishes.forEach(function(dish, dishIndex) {
        if (dish.dish_id === dish_id) {
          dish.users.splice(dish.users.indexOf(user_id), 1);
          if (dish.users.length === 0) {
            services.data.dishes.splice(dishIndex, 1);
          }
        }
      });
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

    function getUsersByDish(dish, users) {
      return arrayToSentence(
        _(dish.users).map(function(id) {
          return users[_.findIndex(users, {
            'id': id
          })].username;
        }).value());
      //   return {
      //     username: users[index].username,
      //     user_id: parseInt(users[index].id),
      //     isHost: users[index].host
      //   };
    }

    function initListeners() {
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
        shareDish(data.dish_id, data.user_id);
      });

      socketFactory.on('dishUnshared', function(data) {
        console.log("Heard 'dishUnshared' in appFactory.data:", data);
        unshareDish(data.dish_id, data.user_id);
      });

      socketFactory.on('billsSentToGuests', function(data) {
        console.log("Heard 'billsSentToGuests' in appFactory.data:", data);
        services.data.billData = data;

        $rootScope.$broadcast('billsSentToGuests');
        // $rootScope.$broadcast('billsSentToGuests', data);
        // $rootScope.$apply();
      });

    }
  }
})();
