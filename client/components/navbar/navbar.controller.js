(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory', '$window'];


  function NavbarCtrl(appFactory, $window) {

    var self = this;

    self.logout = appFactory.logout;

    self.isLoggedIn = function () {
      return $window.localStorage.getItem('username');
    };
  }

})();
