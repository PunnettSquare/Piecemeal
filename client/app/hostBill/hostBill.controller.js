// # HostBill Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Allow host to see all dishes, enter tip and tax, and send final bill.


(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory', 'socketFactory', '$scope'];

  // **Parameters:** TODO

  function HostBillCtrl(appFactory, socketFactory, $scope) {
    var self = this;
    
    appFactory.copySessData(self);

    appFactory.checkCode();
    
    // Load data on page refresh
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      self.getDishIndivCost = appFactory.getDishIndivCost;
    });

    // Load data when *not* on page refresh
    self.data = appFactory.data;

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
    } else {
      self.billsSent = true;

    }

    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.getUsersByDish = appFactory.getUsersByDish;

    self.tipType = {
      value : 'percent'
    };

    self.taxType = {
      value : 'percent'
    };

    self.repopulateTip = function(billData) {
      return (!billData) ? 0 : billData.tipPercent;
    };

    self.repopulateTax = function(billData) {
      return (!billData) ? 0 : billData.taxPercent;
    };

    self.repopulateFee = function(billData) {
      return (!billData) ? 0 : billData.feePercent;
    };

    self.repopulateDiscount = function(billData) {
      return (!billData) ? 0 : billData.discountPercent;
    };

    self.getTip = function(dollarOrPercent) {
      if (!self.data) {
        return 0;
      }

      if (self.tipType.value === 'dollar') {
        if (dollarOrPercent === 'dollar') {
          return self.tip;
        } else if (dollarOrPercent === 'percent') {
          var num = self.tip / self.getSubTotal(self.data.dishes) * 100;
          return Math.round(num * 100) / 100; // round to 2 decimal places
        }
      } else if (self.tipType.value === 'percent') {
        if (dollarOrPercent === 'dollar') {
          return self.tip * 0.01 * self.getSubTotal(self.data.dishes);
        } else if (dollarOrPercent === 'percent') {
          return self.tip;
        }
      }
    };

    self.getTax = function(dollarOrPercent) {
      if (!self.data) {
        return 0;
      }

      if (self.taxType.value === 'dollar') {
        if (dollarOrPercent === 'dollar') {
          return self.tax;
        } else if (dollarOrPercent === 'percent') {
          var num = self.tax / self.getSubTotal(self.data.dishes) * 100;
          return Math.round(num * 100) / 100; // round to 2 decimal places
        }
      } else if (self.taxType.value === 'percent') {
        if (dollarOrPercent === 'dollar') {
          return self.tax * 0.01 * self.getSubTotal(self.data.dishes);
        } else if (dollarOrPercent === 'percent') {
          return self.tax;
        }
      }
    };

    self.getFeeOrDiscountPercent = function(feeOrDiscount) {
      if (!self.data) {
        return 0;
      }
      var subtotal = self.getSubTotal(self.data.dishes);

      if (feeOrDiscount === 'fee') {
        var num = self.fee / subtotal * 100;
      } else if (feeOrDiscount === 'discount') {
        var num = self.discount / subtotal * 100;
      }
      return Math.round(num * 100) / 100; // round to 2 decimal places
    };

    self.getSubTotal = function(dishes) {
      return _.sum(_.pluck(dishes, 'cost'));
    };

    self.getGrandTotal = function() {
      return self.getSubTotal(self.data.dishes) + self.getTip('dollar') + self.getTax('dollar') + self.fee - self.discount;
    };

    self.sendBillsToGuests = function() {
      socketFactory.emit('sendBillToGuests', {
        event_id: self.event_id,
        code: self.code,
        hostUsername: self.username,
        host_id: self.user_id,
        subTotal: self.getSubTotal(self.data.dishes),
        taxPercent: self.getTax('percent'),
        tipPercent: self.getTip('percent'),
        feePercent: self.getFeeOrDiscountPercent('fee'),
        discountPercent: self.getFeeOrDiscountPercent('discount'),
        grandTotal: self.getGrandTotal(),
        billSent: true
      });
      self.billsSent = true;
    };

    self.sendBillAndAlert = function () {
      self.sendBillsToGuests();
      Materialize.toast('Bills sent successfully!', 4000);
    };

    self.logout = appFactory.logout;
  }
})();
