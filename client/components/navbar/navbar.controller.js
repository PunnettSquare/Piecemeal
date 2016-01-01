// # Navbar Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory', '$window', '$location'];

  function NavbarCtrl(appFactory, $window, $location) {
  // **Parameters:** TODO

    var self = this;
    self.isVenmo = $window.localStorage.venmoUsername;
    var url = $window.location.hash;
    var pieces = url.split('/');

    if (pieces.length === 2 && pieces[1] !== 'home') {
      $location.path(url.slice(2) + '/');
    }

    self.logoutVenmo = function() {
      $window.localStorage.clear();
      self.isVenmo = false;
      $window.location.reload();
    };

    //copy session data to scope
    appFactory.copySessData(self);

    self.isLoggedIn = function() {
      return $window.localStorage.getItem('username');
    };

    self.logout = appFactory.logout;

  }

})();
