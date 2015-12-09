(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostBillCtrl', HostBillCtrl);

  HostBillCtrl.$inject = ['appFactory'];

  function HostBillCtrl(appFactory) {
    var self = this;

    self.data = appFactory.data;

    self.goToGuestBill = function() {
      $location.path('/' + window.sessionStorage.code + '/guestBill');
    };

    self.allDishes = _.each(self.data.dishes,
      function(obj, key) {
        console.log('obj, key =', obj, key);
        obj.indivCost = obj.cost / obj.users.length;
        obj.isShared = (obj.users.length === 1) ? false : true;
        obj.users = _.map(obj.users, function(id) {
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

    self.subTotal = _.sum(_.pluck(self.allDishes, 'cost'));
    self.tax = 0;
    self.tip = 0;
  }

})();
