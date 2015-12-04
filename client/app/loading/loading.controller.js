(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = [];

  function LoadingCtrl() {
    var self = this;


    self.setSessionUser = function(username) {
      window.sessionStorage.setItem('username', username);
    };
  }

})();
