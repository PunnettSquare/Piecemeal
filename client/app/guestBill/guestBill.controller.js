(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['socketFactory', '$scope', 'appFactory', '$location'];

  function GuestBillCtrl(socketFactory, $scope, appFactory, $location) {
    var self = this;
    self.data = appFactory.data;
    self.isHost = window.sessionStorage.isHost;

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.goToHostBill = function() {
      $location.path('/' + window.sessionStorage.code + '/hostBill');
    };

    self.username = window.sessionStorage.username;
    self.user_id = parseInt(window.sessionStorage.user_id);

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
            user_id: self.data.users[index].id,
            isHost: self.data.users[index].host
          };
        });
      });
  }

})();

// db queries
// input: username + id + event
// outputs:
// list of dishes & costs
// how many people sharing dish

// socket broadcast
// remove meal
// share meal

// global listener (already on app.socket.init)
// any added dishes from other people (in real time)

// calculate:
// filter total list for user-only dishes
//   calculate cost of each shared dish by dividing by # of people sharing it
//      your total bill
// dinner party total bill (reduce total list cost)
