(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory', '$window', '$location'];

  function NavbarCtrl(appFactory, $window, $location) {

    var self = this;
    self.isVenmo = $window.localStorage.venmoUsername;
    var url = $window.location.hash
    var pieces = url.split('/')

    if (pieces.length === 2 && pieces[1] !== 'home') {
      $location.path(url.slice(2) + '/');
    }

    self.logoutVenmo = function() {
      $window.localStorage.clear();
      self.isVenmo = false;
      $window.location.reload();
    };

    appFactory.copySessData(self); //copy session data to scope

    self.isLoggedIn = function() {
      return $window.localStorage.getItem('username');
    };

    self.logout = appFactory.logout; // remove this line from other controllers

  }

})();
