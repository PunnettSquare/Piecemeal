(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['$scope', 'appFactory', 'addDishFactory'];

  function GuestBillCtrl($scope, appFactory, addDishFactory) {
    var self = this;

    appFactory.copySessData(self);

    self.data = appFactory.data;
    self.data.billData = appFactory.data.billData;

    // if bill was already sent to guest and the guest wasn't on the guestBill page
    // then they can get the data here
    if (!_.isEmpty(appFactory.data.billData)) {
      self.data.billData = appFactory.data.billData;
    }

    self.logout = appFactory.logout;
    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.venmoUsername = appFactory.data.venmoUsername;
    self.getGuestDishes = _.memoize(function(user_id, dishes) {
      return _.filter(dishes, function(obj, key) {
        return _.contains(obj.users, user_id);
      });
    });

    // bill being sent while guest is on guestBill page for the first time
    $scope.$on('billsSentToGuests', function() {
      self.data.billData = appFactory.data.billData;
      console.log("Bill received by guest", self.data.billData);
    });

    self.getGuestTotal = function(data) {
      return addDishFactory.calculateRunningTotal(data);
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
      return self.data.billData.taxPercent * self.getGuestTotal(self.data) * 0.01;
    };

    self.getGuestTip = function() {
      return self.data.billData.tipPercent * self.getGuestTotal(self.data) * 0.01;
    };

    self.getGuestGrandTotal = function() {
      return self.getGuestTotal(self.data) + (self.getGuestTax()) + (self.data.billData.tipPercent * self.getGuestTotal(self.data) * 0.01);
    };

  }
})();
