(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AddDishCtrl', AddDishCtrl);

  AddDishCtrl.$inject = ['socketFactory', 'addDishFactory', 'appFactory'];

  function AddDishCtrl(socketFactory, addDishFactory, appFactory) {

    var self = this;

    appFactory.copySessData(self);

    self.data = appFactory.data;
    self.logout = appFactory.logout;

    // if (!appFactory.data) {
    //   self.data = getInfo;
    //   appFactory.data = getInfo;
    // }

    self.addDish = function(name, cost) {
      var dish = {
        cost: Number(cost),
        name: name,
        user_id: self.user_id,
        event_id: self.event_id,
        users: [self.user_id]
      };
      socketFactory.emit('addDish', dish);
      self.userTotal += cost;
      self.amount = '';
      self.dishName = '';
      self.addedDish = true;
      self.previousDish = name;
    };

    self.calcUserCurrentTotal = function(data) {
      self.userTotal = addDishFactory.calculateRunningTotal(data);
    };
    self.calcUserCurrentTotal(self.data);
  }

})();
