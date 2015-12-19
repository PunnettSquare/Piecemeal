(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$window'];

  function HomeCtrl($window) {

    var self = this;

    self.setSessionUser = function(code) {
      _.assign($window.localStorage, {
        code: code.toLowerCase(),
        isHost: false
      });
    };

  }
})();
