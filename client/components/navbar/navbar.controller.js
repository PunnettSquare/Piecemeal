(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory'];

  function NavbarCtrl(appFactory) {
    var self = this;
    self.logout = appFactory.logout;
    self.goToAllDishes = appFactory.goToAllDishes;
    self.goToGuestBill = appFactory.goToGuestBill;
    self.goToAddDish = appFactory.goToAddDish;
    self.goToHostBill = appFactory.goToHostBill;

  }

})();
