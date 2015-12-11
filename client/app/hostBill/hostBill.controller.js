(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory', 'socketFactory', '$location'];

  function HostBillCtrl(appFactory, socketFactory, $location) {
    var self = this;

    self.data = appFactory.data;

    if (self.data) {
      // This will entirely depend on data reformat of appFactory.data.
      self.allDishes = _.each(self.data.dishes,
        function(obj, key) {
          obj.indivCost = obj.cost / obj.users.length;
          obj.isShared = (obj.users.length === 1) ? false : true;
          obj.userSummary = _.map(obj.users, function(id) {
            var index = _.findIndex(self.data.users, {
              'id': id
            });
            return {
              username: self.data.users[index].username,
              user_id: parseInt(self.data.users[index].id),
              isHost: self.data.users[index].host
            };
          });
        });
      self.subTotal = _.sum(_.pluck(self.allDishes, 'cost'));
    }

    self.sendBillsToGuests = function() {
      self.tipSum = (self.subTotal * self.tip * 0.01) + self.subTotal;
      self.taxSum = (self.subTotal * self.tax * 0.01) + self.subTotal;
      self.grandTotal = self.subTotal + self.tax + self.tipSum;

      socketFactory.emit('sendBillToGuests', {
        event_id: appFactory.getSessStorage('event_id'),
        code: appFactory.getSessStorage('code'),
        hostUsername: appFactory.getSessStorage('username'),
        host_id: appFactory.getSessStorage('user_id'),
        subTotal: self.subTotal,
        taxPercent: self.tax,
        tipPercent: self.tip,
        tipSum: self.tipSum,
        taxSum: self.taxSum,
        grandTotal: self.grandTotal
      });
      self.billsSent = true;
    };

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };

  }

})();
