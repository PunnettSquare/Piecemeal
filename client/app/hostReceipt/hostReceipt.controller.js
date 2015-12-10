(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostReceiptCtrl', HostReceiptCtrl);

  HostReceiptCtrl.$inject = ['$scope'];

  function HostReceiptCtrl($scope) {
    var self = this;

    self.test = "test"; //for spec tests, remove later

  }

})();
