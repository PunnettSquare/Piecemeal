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

    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.getUsersByDish = appFactory.getUsersByDish;

    self.tipType = 'percent';
    self.taxType = 'percent';

    self.getTip = function() {
      if (self.tipType === 'dollar') {
        return self.tip;
      } else if (self.tipType === 'percent') {
        return self.tip * 0.01 * self.getSubTotal(self.data.dishes);
      }
    };

    self.getTipPercent = function() {
      if (self.tipType === 'dollar') {
        var num = self.tip/self.getSubTotal(self.data.dishes) * 100;
        return Math.round(num * 100) / 100; // round to 2 decimal places
      } else if (self.tipType === 'percent') {
        return self.tip;
      }
    };

    self.getTax = function() {
      if (self.taxType === 'dollar') {
        return self.tax;
      } else if (self.taxType === 'percent') {
        return self.tax * 0.01 * self.getSubTotal(self.data.dishes);
      }
    };

    self.getTaxPercent = function() {
      if (self.taxType === 'dollar') {
        var num = self.tax/self.getSubTotal(self.data.dishes) * 100;
        return Math.round(num * 100) / 100; // round to 2 decimal places
      } else if (self.taxType === 'percent') {
        return self.tax;
      }
    };

    self.getSubTotal = function(dishes) {
      return _.sum(_.pluck(dishes, 'cost'));
    };

    self.sendBillsToGuests = function() {
      self.grandTotal = self.getSubTotal(self.data.dishes) + self.getTip() + self.getTax();

      socketFactory.emit('sendBillToGuests', {
        event_id: self.event_id,
        code: self.code,
        hostUsername: self.username,
        host_id: self.user_id,
        subTotal: self.getSubTotal(self.data.dishes),
        taxPercent: self.getTaxPercent(),
        tipPercent: self.getTipPercent(),
        grandTotal: self.grandTotal
      });
      self.billsSent = true;
    };

    self.logout = appFactory.logout;
  }
})();
