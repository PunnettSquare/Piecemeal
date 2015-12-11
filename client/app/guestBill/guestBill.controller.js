(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['socketFactory', '$scope', 'appFactory', '$location', 'addDishFactory'];

  function GuestBillCtrl(socketFactory, $scope, appFactory, $location, addDishFactory) {
    var self = this;

    self.isHost = appFactory.getSessStorage('isHost');
    self.username = appFactory.getSessStorage('username');
    self.user_id = appFactory.getSessStorage('user_id');
    self.event_id = appFactory.getSessStorage('event_id');

    self.billSent = false;
    self.data = appFactory.data;
    self.billData = appFactory.data.billData;

    self.getGuestDishes = function(user_id, dishes) {
      return _.filter(dishes, function(obj, key) {
        return _.contains(obj.users, user_id);
      });
    };

    self.getDishIndivCost = function(user_id, dish) {
      return dish.cost / dish.users.length;
    };

    // self.getDishesIndivCost = function(user_id, dishes, users) {
    //   return self.getGuestDishes(user_id, dishes, users).map(function(obj, key) {
    //     return obj.cost / obj.users.length;
    //   });
    // };

    self.isDishShared = function(user_id, dish) {
      return dish.users.length === 1 ? false : true;
    };

    // self.isShared = function(user_id, dishes, users) {
    //   return self.getGuestDishes(user_id, dishes, users).map(function(obj, key) {
    //     return (obj.users.length === 1) ? false : true;
    //   });
    // };

    self.getOtherSharedUserForDish = function(user_id, dish, users) {
      return dish.users.filter(function(userId) {
        return userId !== user_id;
      }).map(function(id) {
        var index = _.findIndex(users, {
          'id': id
        });
        return {
          username: users[index].username,
          user_id: users[index].id,
          isHost: users[index].host
        };
      });
    };

    // self.guestDishes = _.each(
    //   _.filter(self.data.dishes,
    //     function(obj, key) {
    //       return _.contains(obj.users, self.user_id);
    //     }),
    //   function(obj, key) {
    //     obj.indivCost = obj.cost / obj.users.length;
    //     obj.isShared = (obj.users.length === 1) ? false : true;
    //     obj.otherSharedIds = _.filter(obj.users, function(id) {
    //       return id !== self.user_id;
    //     });
    //     obj.otherSharedUsers = _.map(obj.otherSharedIds, function(id) {
    //       var index = _.findIndex(self.data.users, {
    //         'id': id
    //       });
    //       return {
    //         username: self.data.users[index].username,
    //         user_id: parseInt(self.data.users[index].id),
    //         isHost: self.data.users[index].host
    //       };
    //     });
    //   });

    // bill being sent while guest is on guestBill page for the first time
    $scope.$on('billsSentToGuests', function() {
      self.billData = appFactory.data.billData;
      console.log('self.billData =', self.billData);
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
    if (self.billData) {
      self.showGuestBill();
    }

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToHostBill = function() {
      $location.path('/' + window.sessionStorage.code + '/hostBill');
    };
  }
})();
