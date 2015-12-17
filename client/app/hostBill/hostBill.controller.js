(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory', 'socketFactory', '$scope'];

  function HostBillCtrl(appFactory, socketFactory, $scope) {
    var self = this;

    appFactory.copySessData(self);

    // load data on page refresh
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      self.getDishIndivCost = appFactory.getDishIndivCost;
    });

    // load data when *not* on page refresh
    self.data = appFactory.data;

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
    } else {
      self.billsSent = true;
    }

    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.getUsersByDish = appFactory.getUsersByDish;

    self.tipType = 'percent';
    self.taxType = 'percent';
    self.fee = 0;
    self.discount = 0;

    self.repopulateTip = function(billData) {
      return (!billData) ? 0 : billData.tipPercent;
    };

    self.repopulateTax = function(billData) {
      return (!billData) ? 0 : billData.taxPercent;
    };

    self.getTip = function() {
      if (!self.data) {
        return 0;
      }
      if (self.tipType === 'dollar') {
        return self.tip;
      } else if (self.tipType === 'percent') {
        return self.tip * 0.01 * self.getSubTotal(self.data.dishes);
      }
    };

    // TODO: To be refactored later
    self.getTipPercent = function() {
      if (!self.data) {
        return 0;
      }
      if (self.tipType === 'dollar') {
        var num = self.tip / self.getSubTotal(self.data.dishes) * 100;
        return Math.round(num * 100) / 100; // round to 2 decimal places
      } else if (self.tipType === 'percent') {
        return self.tip;
      }
    };

    self.getTax = function() {
      if (!self.data) {
        return 0;
      }
      if (self.taxType === 'dollar') {
        return self.tax;
      } else if (self.taxType === 'percent') {
        return self.tax * 0.01 * self.getSubTotal(self.data.dishes);
      }
    };
    // TODO: To be refactored later
    self.getTaxPercent = function() {
      if (!self.data) {
        return 0;
      }
      if (self.taxType === 'dollar') {
        var num = self.tax / self.getSubTotal(self.data.dishes) * 100;
        return Math.round(num * 100) / 100; // round to 2 decimal places
      } else if (self.taxType === 'percent') {
        return self.tax;
      }
    };

    self.getFeePercent = function () {
      var subtotal = self.getSubTotal(self.data.dishes);
      var num = self.fee/subtotal * 100;
      return Math.round(num * 100) / 100; // round to 2 decimal places
    };

    self.getDiscountPercent = function () {
      var subtotal = self.getSubTotal(self.data.dishes);
      var num = self.discount/subtotal * 100;
      return Math.round(num * 100) / 100; // round to 2 decimal places
    };

    self.getSubTotal = function(dishes) {
      return _.sum(_.pluck(dishes, 'cost'));
    };

    self.getGrandTotal = function() {
      return self.getSubTotal(self.data.dishes) + self.getTip() + self.getTax() + self.fee - self.discount;
    };

    self.sendBillsToGuests = function() {
      socketFactory.emit('sendBillToGuests', {
        event_id: self.event_id,
        code: self.code,
        hostUsername: self.username,
        host_id: self.user_id,
        subTotal: self.getSubTotal(self.data.dishes),
        taxPercent: self.getTaxPercent(),
        tipPercent: self.getTipPercent(),
        feePercent: self.getFeePercent(),
        discountPercent: self.getDiscountPercent(),
        grandTotal: self.getGrandTotal()
      });
      self.billsSent = true;
    };

    self.logout = appFactory.logout;
  }
})();
