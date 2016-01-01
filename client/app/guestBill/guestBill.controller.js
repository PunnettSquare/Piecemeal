// # GuestBill Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['$scope', 'appFactory', 'allDishesFactory', 'socketFactory', '$timeout'];

  // **Parameters:** TODO

  function GuestBillCtrl($scope, appFactory, allDishesFactory, socketFactory, $timeout) {
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
      console.log(self.data);
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

    //remove?
    self.getGuestTotal = function(data) {
      return allDishesFactory.calculateRunningTotal(data);
    };

    //remove
    self.getGrandTotal = function(dishes, billData) {
      return (!self.data) ? 0 : _.sum(_.pluck(dishes, 'cost')) + self.getGuestTip() + self.getGuestTax();
    };

    self.getOtherUsersByUsername = function(dish, users, user_id) {
      return appFactory.arrayToSentence(
        _(dish.users).filter(function(id) {
          return id !== user_id;
        })
        .map(function(id) {
          return users[_.findIndex(users, {
            'id': id
          })].username;
        }).value()
      );
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
      return allDishesFactory.calculateRunningTotal(data);
    };

    self.getGuestGrandTotal = function() {
      // return (!self.data) ? 0 : Math.round(
      //   (self.getGuestTotal(self.data)
      //     + (self.data.billData.taxPercent * self.getGuestTotal(self.data) * 0.01)
      //     + (self.data.billData.tipPercent * self.getGuestTotal(self.data) * 0.01)
      //   )*100)/100;

      return (!self.data) ? 0 : Math.round((
        self.getGuestTotal(self.data) + self.getGuestTax() + self.getGuestTip() + self.getGuestFee() - self.getGuestDiscount()
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
