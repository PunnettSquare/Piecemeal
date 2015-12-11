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

    self.data = appFactory.data;
    self.billData = appFactory.data.billData;

    self.getGuestDishes = _.memoize(function(user_id, dishes) {
      return _.filter(dishes, function(obj, key) {
        return _.contains(obj.users, user_id);
      });
    });

    // self.isGuestDish = function(user_id, dish) {
    //   return _.contains(dish.users, user_id);
    // };

    self.getDishIndivCost = function(user_id, dish) {
      //   if (self.isGuestDish(user_id, dish)) {
      return dish.cost / dish.users.length;
      //   }
    };

    // self.getDishesIndivCost = function(user_id, dishes, users) {
    //   return self.getGuestDishes(user_id, dishes, users).map(function(obj, key) {
    //     return obj.cost / obj.users.length;
    //   });
    // };

    self.isDishShared = function(user_id, dish) {
      //   if (self.isGuestDish(user_id, dish)) {
      return dish.users.length === 1 ? false : true;
      // }
    };

    // self.areDishesShared = function(user_id, dishes, users) {
    //   return self.getGuestDishes(user_id, dishes, users).map(function(obj, key) {
    //     return (obj.users.length === 1) ? false : true;
    //   });
    // };

    // self.getOtherSharedUserForDish = _.memoize(function(user_id, dish, users) {
    //   return dish.users.filter(function(userId) {
    //     return userId !== user_id;
    //   }).map(function(id) {
    //     var index = _.findIndex(users, {
    //       'id': id
    //     });
    //     return {
    //       username: users[index].username,
    //       user_id: users[index].id,
    //       isHost: users[index].host
    //     };
    //   });
    // });

    // self.isGuestDish = function(user_id, dish) {
    //   return _.contains(dish.users, user_id);
    // };

    self.isDishSharedWithThisOtherUser = function(otherPersonId, dish) {
      return _.contains(dish.users, otherPersonId);
    };

    self.getGuestTotal = function(data) {
      return addDishFactory.calculateRunningTotal(data);
    };

    // bill being sent while guest is on guestBill page for the first time
    $scope.$on('billsSentToGuests', function() {
      self.billData = appFactory.data.billData;
      console.log('self.billData =', self.billData);
      console.log("Bill received by guest", self.billData);
      self.showGuestBill();
    });

    self.showGuestBill = function() {
      self.guestTax = self.billData.taxPercent * self.guestSubtotal * 0.01;
      self.guestTip = self.billData.tipPercent * self.guestSubtotal * 0.01;
      self.guestGrandTotal = self.guestSubtotal + self.guestTip + self.guestTax;
      self.billSent = true;
    };

    // if bill was already sent to guest and the guest wasn't on the guestBill page
    // then they can get the data here
    if (!_.isEmpty(self.billData)) {
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
