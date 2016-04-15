// # GuestBill Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Reflect the dishes a user has added or shared and the subtotal. When host sends final bill with tip and tax, the user can choose to pay with Venmo or Cash.

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['$scope', 'appFactory', 'socketFactory', '$timeout'];

  // **Parameters:** TODO

  function GuestBillCtrl($scope, appFactory, socketFactory, $timeout) {
    var self = this;

    // Copy data from ```window.localStorage``` onto the $scope.
    appFactory.copySessData(self);

    appFactory.checkCode();

    // **Assign appFactory data to scope, upon hearing 'joined' emitted by $rootScope.**

    // Copy the data emitted by appFactory through ```$rootScope```, upon hearing a 'joined' event, thus ensuring the latest data is on the scope.
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      self.getDishIndivCost = appFactory.getDishIndivCost;
      self.venmoUsername = appFactory.data.venmoUsername;
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
    } else {
      self.getDishIndivCost = appFactory.getDishIndivCost;
      self.venmoUsername = appFactory.data.venmoUsername;
    }

    // **TODO the rest**
    $scope.$on('billsSentToGuests', function() {
      self.data.billData = appFactory.data.billData;
    });

    // self.getGuestDishes = _.memoize(function(user_id, dishes) {
    //   return _.filter(dishes, function(obj, key) {
    //     return _.contains(obj.users, user_id);
    //   });
    // });
    self.getGuestDishes = function(user_id, dishes) {
      return (!self.data) ? [] : _.filter(dishes, function(obj, key) {
        return _.contains(obj.users, user_id);
      });
    };

    self.getOtherUsersByUsername = function(dish, users, user_id) {

      var tracker = {};

      var dishUsers = dish.users.slice();

      dishUsers = _.filter(dish.users, function (id) {
        return id !== user_id;
      });

      _.each(dishUsers, function (user_id) {
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

      return appFactory.arrayToSentence(shares)

    };

    self.getGuestTax = function() {
      return (!self.data) ? 0 : self.data.billData.taxPercent * self.getGuestSubtotal(self.data) * 0.01;
    };

    self.getGuestTip = function() {
      return (!self.data) ? 0 : self.data.billData.tipPercent * self.getGuestSubtotal(self.data) * 0.01;
    };

    self.getGuestFee = function() {
      return (!self.data) ? 0 : self.data.billData.feePercent * self.getGuestSubtotal(self.data) * 0.01;
    };

    self.getGuestDiscount = function() {
      return (!self.data) ? 0 : self.data.billData.discountPercent * self.getGuestSubtotal(self.data) * 0.01;
    };

    self.getGuestSubtotal = function(data) {
      return appFactory.calculateRunningTotal(data);
    };

    self.getGuestGrandTotal = function() {
      return (!self.data) ? 0 : Math.round((
        self.getGuestSubtotal(self.data) + self.getGuestTax() + self.getGuestTip() + self.getGuestFee() - self.getGuestDiscount()
      ) * 100) / 100;
    };

    self.getAllSubtotal = function(dishes) {
      return (!self.data) ? 0 : _.sum(_.pluck(dishes, 'cost'));
    };

    self.cashAlert = function () {
      Materialize.toast('We have notified the host that you will be<br>paying with cash.', 4000);
    };

    self.venmoAlert = function () {
      $timeout(function(){
        Materialize.toast('Venmo app required.', 4000);
      }, 1000);
    };

    //remove:
    // self.getGrandTotal = function(dishes, billData) {
    //   return (!self.data) ?  0 : _.sum(_.pluck(dishes, 'cost')) + self.getGuestTip() + self.getGuestTax();
    //   }
    // };
  }

})();
