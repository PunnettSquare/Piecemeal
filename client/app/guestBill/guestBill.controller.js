(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['$scope', 'appFactory', 'allDishesFactory', 'socketFactory'];

  function GuestBillCtrl($scope, appFactory, allDishesFactory, socketFactory) {
    var self = this;
    appFactory.copySessData(self);

    // load data on page refresh
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      self.data.billData = appFactory.data.billData; // check later
      self.getDishIndivCost = appFactory.getDishIndivCost;
      self.venmoUsername = appFactory.data.venmoUsername;
    });

    // load data when *not* on page refresh
    self.data = appFactory.data;

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
    } else {
      self.getDishIndivCost = appFactory.getDishIndivCost;
      self.venmoUsername = appFactory.data.venmoUsername;
    }

    $scope.$on('billsSentToGuests', function() {
      self.data.billData = appFactory.data.billData;
      window.localStorage.billSent = true;
      self.billSent = true;
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

    //remove:
    // self.getGrandTotal = function(dishes, billData) {
    //   return (!self.data) ?  0 : _.sum(_.pluck(dishes, 'cost')) + self.getGuestTip() + self.getGuestTax();
    //   }
    // };
  };

})();
