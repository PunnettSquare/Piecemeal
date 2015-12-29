(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$window', 'homeFactory', '$location'];

  function HomeCtrl($window, homeFactory, $location) {

    var self = this;

    self.incorrectCode = false;

    self.setSessionUser = function(code) {
      homeFactory.checkCode(code.toLowerCase())
      .then(function(validCode) {
        if (validCode.data) {
          _.assign($window.localStorage, {
            code: code.toLowerCase(),
            isHost: false
          });
          $location.path('/' + $window.localStorage.code + '/loading');
        } else {
          self.incorrectCode = true;
        }
      });
    };

  }
})();
