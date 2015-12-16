(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$window'];

  function HomeCtrl($window) {

    var self = this;

    self.setSessionUser = function(code) {
      _.assign($window.sessionStorage, {
        code: code,
        isHost: false
      });
    };

  }
})();
