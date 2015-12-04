(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = ['$sessionStorage'];

  function LoadingCtrl($sessionStorage) {
    var self = this;


    self.setSessionUser = function(username) {
      $sessionStorage.username = username;
    };
  }

})();
