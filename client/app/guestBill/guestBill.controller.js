(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['socketFactory', '$scope', 'appFactory', '$location', 'addDishFactory'];

  function GuestBillCtrl(socketFactory, $scope, appFactory, $location, addDishFactory) {
    var self = this;
    self.data = appFactory.data;

    self.username = window.sessionStorage.username;
    self.user_id = parseInt(window.sessionStorage.user_id);
    self.isHost = window.sessionStorage.isHost;
    self.billSent = false;

    // bill being sent while guest is on guestBill page for the first time
    $scope.$on('billsSentToGuests', function() {
      self.billData = appFactory.billData;
      console.log("Bill received by guest", self.billData);
      self.showGuestBill();
    });

    self.showGuestBill = function() {
      self.guestSubtotal = addDishFactory.calculateRunningTotal(self.data);
      self.guestTax = self.billData.taxPercent * self.guestSubtotal * 0.01;
      self.guestTip = self.billData.tipPercent * self.guestSubtotal * 0.01;
      self.guestGrandTotal = self.guestSubtotal + self.guestTip + self.guestTax;
      self.billSent = true;
    };

    // if bill was already sent to guest and the guest wasn't on the guestBill page
    // then they can get the data here
    self.billData = appFactory.billData;
    if (self.billData) {
      self.showGuestBill();
    }

    self.guestDishes = _.each(
      _.filter(self.data.dishes,
        function(obj, key) {
          return _.contains(obj.users, self.user_id);
        }),
      function(obj, key) {
        obj.indivCost = obj.cost / obj.users.length;
        obj.isShared = (obj.users.length === 1) ? false : true;
        obj.otherSharedIds = _.filter(obj.users, function(id) {
          return id !== self.user_id;
        });
        obj.otherSharedUsers = _.map(obj.otherSharedIds, function(id) {
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

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToHostBill = function() {
      $location.path('/' + window.sessionStorage.code + '/hostBill');
    };
  }
})();
