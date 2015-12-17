(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory', 'socketFactory'];

  function HostBillCtrl(appFactory, socketFactory) {
    var self = this;

    appFactory.copySessData(self);

    self.data = appFactory.data;
    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.getUsersByDish = appFactory.getUsersByDish;
    self.logout = appFactory.logout;

    self.test=function(){console.log("test"); };
    self.taxType = 'percent';

    self.getTax = function() {
      if (self.taxType === 'dollar') {
        return self.tax;
      } else if (self.taxType === 'percent') {
        return self.tax * 0.01;
      }
    };

    // self.updateTax = function (taxType) {
    //   if (taxType === 'dollar') {
    //     console.log('dollarrr'); 
    //     self.tax = self.taxEntry;
    //   } else if (taxType === 'percent') {
    //     console.log('percennnnt'); 
    //     self.tax = self.taxEntry * 0.01;
    //   }
    // };

    self.getSubTotal = function(dishes) {
      return _.sum(_.pluck(dishes, 'cost'));
    };

    self.sendBillsToGuests = function() {
      self.tipSum = (self.getSubTotal(self.data.dishes) * self.tip * 0.01) + self.getSubTotal(self.data.dishes);
      self.taxSum = (self.getSubTotal(self.data.dishes) * self.tax * 0.01) + self.getSubTotal(self.data.dishes);
      self.grandTotal = self.getSubTotal(self.data.dishes) + (self.tip * 0.01 * self.getSubTotal(self.data.dishes)) + (self.tax * 0.01 * self.getSubTotal(self.data.dishes));

      socketFactory.emit('sendBillToGuests', {
        event_id: self.event_id,
        code: self.code,
        hostUsername: self.username,
        host_id: self.user_id,
        subTotal: self.getSubTotal(self.data.dishes),
        taxPercent: self.tax,
        tipPercent: self.tip,
        tipSum: self.tipSum,
        taxSum: self.taxSum,
        grandTotal: self.grandTotal
      });
      self.billsSent = true;
    };
  }
})();
