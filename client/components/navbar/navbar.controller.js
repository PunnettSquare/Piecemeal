// # Navbar Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory', '$window'];

  // **Parameters:** TODO

  function NavbarCtrl(appFactory, $window) {

    var self = this;
    // self.isVenmo = $window.localStorage.venmoUsername;

    // self.logoutVenmo = function() {
    //   $window.localStorage.clear();
    //   self.isVenmo = false;
    //   $window.location.reload();
    // };

    //copy session data to scope
    appFactory.copySessData(self); 

    self.isLoggedIn = function() {
      return $window.localStorage.getItem('username');
    };

    self.logout = appFactory.logout; 

  }

})();
