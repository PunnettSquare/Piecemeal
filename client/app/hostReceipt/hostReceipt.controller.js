(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HostReceiptCtrl', HostReceiptCtrl);

  HostReceiptCtrl.$inject = ['appFactory', 'socketFactory', '$scope'];

  function HostReceiptCtrl(appFactory, socketFactory, $scope) {
    var self = this;

    appFactory.copySessData(self);

    // load data on page refresh
    $scope.$on('joined', function() {
      self.data = appFactory.data;
      self.getDishIndivCost = appFactory.getDishIndivCost;
    });

    // load data when *not* on page refresh
    self.data = appFactory.data;

    if (!appFactory.data) {
      socketFactory.init();
      appFactory.initListeners();
    } else {
      self.billsSent = true;
    }

    self.getDishIndivCost = appFactory.getDishIndivCost;
    self.getUsersByDish = appFactory.getUsersByDish;

    // console.log("data: ", self.data); 
    // console.log("data.users: ", self.data.users); 
    appFactory.getUsers();

    self.logout = appFactory.logout;
  }

})();
