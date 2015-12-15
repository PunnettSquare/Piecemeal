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
    self.data.billData = appFactory.data.billData;
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
      self.showGuestBill();
    });

    if (appFactory.getSessStorage('isHost') === true && !_.isEmpty(appFactory.data.billData)) {
      self.data.billData = appFactory.data.billData;
    }

    self.getDishIndivCost = appFactory.getDishIndivCost;

    // self.isGuestDish = function(user_id, dish) {
    //   return _.contains(dish.users, user_id);
    // };

    // self.getDishIndivCost = function(dish) {
    //   return dish.cost / dish.users.length;
    // };

    // self.getDishesIndivCost = function(user_id, dishes, users) {
    //   return self.getGuestDishes(user_id, dishes, users).map(function(obj, key) {
    //     return obj.cost / obj.users.length;
    //   });
    // };

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

    // self.isDishSharedWithThisOtherUser = function(otherPersonId, dish) {
    //   return _.contains(dish.users, otherPersonId);
    // };

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

    self.showGuestBill = function() {
      self.guestTax = self.data.billData.taxPercent * self.getGuestTotal(self.data) * 0.01;
      self.guestTip = self.data.billData.tipPercent * self.getGuestTotal(self.data) * 0.01;
      self.guestGrandTotal = self.getGuestTotal(self.data) + (self.data.billData.taxPercent * self.getGuestTotal(self.data) * 0.01) + (self.data.billData.tipPercent * self.getGuestTotal(self.data) * 0.01);
    };

    // if bill was already sent to guest and the guest wasn't on the guestBill page
    // then they can get the data here
    if (!_.isEmpty(appFactory.data.billData)) {
      self.data.billData = appFactory.data.billData;
      self.showGuestBill();
    }


  }
})();
