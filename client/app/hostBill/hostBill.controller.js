(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory', 'socketFactory', '$location'];

  function HostBillCtrl(appFactory, socketFactory, $location) {
    var self = this;

    self.data = appFactory.data;

    self.getDishIndivCost = appFactory.getDishIndivCost;

    self.getUsersByDish = appFactory.getUsersByDish;

    self.getSubTotal = function(dishes) {
      return _.sum(_.pluck(dishes, 'cost'));
    };

    self.sendBillsToGuests = function() {
      self.tipSum = (self.getSubTotal(self.data.dishes) * self.tip * 0.01) + self.getSubTotal(self.data.dishes);
      self.taxSum = (self.getSubTotal(self.data.dishes) * self.tax * 0.01) + self.getSubTotal(self.data.dishes);
      self.grandTotal = self.getSubTotal(self.data.dishes) + (self.tip * 0.01 * self.getSubTotal(self.data.dishes)) + (self.tax * 0.01 * self.getSubTotal(self.data.dishes));

      socketFactory.emit('sendBillToGuests', {
        event_id: appFactory.getSessStorage('event_id'),
        code: appFactory.getSessStorage('code'),
        hostUsername: appFactory.getSessStorage('username'),
        host_id: appFactory.getSessStorage('user_id'),
        subTotal: self.getSubTotal(self.data.dishes),
        taxPercent: self.tax,
        tipPercent: self.tip,
        tipSum: self.tipSum,
        taxSum: self.taxSum,
        grandTotal: self.grandTotal
      });
      self.billsSent = true;
    };

    self.goToAllDishes = appFactory.goToAllDishes;
    self.goToGuestBill = appFactory.goToGuestBill;
    self.goToAddDish = appFactory.goToAddDish;
    self.goToHostBill = appFactory.goToHostBill;
  }
})();
