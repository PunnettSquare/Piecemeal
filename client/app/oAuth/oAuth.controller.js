(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('OAuthCtrl', OAuthCtrl);

  OAuthCtrl.$inject = ['oAuthFactory'];


  function OAuthCtrl(oAuthFactory) {
    var self = this;
    self.venmoAuth = function () {
      return oAuthFactory.venmoLogin();
    }
    
  }

})();
