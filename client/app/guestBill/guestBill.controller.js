(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('GuestBillCtrl', GuestBillCtrl);

  GuestBillCtrl.$inject = ['socketFactory', '$rootScope'];

  function GuestBillCtrl(socketFactory, $rootScope) {
    var self = this;

    socketFactory.init();

    self.goToAllDishes = function() {
      $location.path('/' + window.sessionStorage.code + '/allDishes');
    };

    self.username = window.sessionStorage.username;
    self.user_id = parseInt(window.sessionStorage.user_id);

    // self.guestDishes = _.each(
    //   _.filter($rootScope.data.dishes,
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
    //       var index = _.findIndex($rootScope.data.users, {
    //         'id': id
    //       });
    //       return {
    //         username: $rootScope.data.users[index].username,
    //         user_id: $rootScope.data.users[index].id,
    //         isHost: $rootScope.data.users[index].host
    //       };
    //     });
    //   });
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
