(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['appFactory', '$window'];

  function NavbarCtrl(appFactory, $window) {

    var self = this;

    appFactory.copySessData(self); //copy session data to scope

    self.isLoggedIn = function() {
      return $window.localStorage.getItem('username');
    };
    
    self.logout = appFactory.logout; // remove this line from other controllers

    // self.routes = $state.get();
    // self.test = "test";
  }


})();
