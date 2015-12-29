// (function() {
//   'use strict';

//   angular.module('Piecemeal')
//     .controller('AddDishCtrl', AddDishCtrl);

//   AddDishCtrl.$inject = ['socketFactory', 'addDishFactory', 'appFactory', '$scope'];

//   function AddDishCtrl(socketFactory, addDishFactory, appFactory, $scope) {

//     var self = this;
//     appFactory.copySessData(self);

//     // load data on page refresh
//     $scope.$on('joined', function() {
//       self.data = appFactory.data;
//       console.log("Joined the Add Dish room.");
//       self.calcUserCurrentTotal(self.data);
//     });

//     // load data when *not* on page refresh
//     self.data = appFactory.data;

//     self.calcUserCurrentTotal = function(data) {
//       return (!data) ? 0 : addDishFactory.calculateRunningTotal(data);
//     };

//     if (!appFactory.data) {
//       socketFactory.init();
//       appFactory.initListeners();
//     } else {
//       self.calcUserCurrentTotal(self.data);
//     }

//     self.addDish = function(name, cost) {
//       var dish = {
//         cost: Number(cost),
//         name: name,
//         user_id: self.user_id,
//         event_id: self.event_id,
//         users: [self.user_id]
//       };
//       socketFactory.emit('addDish', dish);
//       // self.userTotal += cost;
//       self.amount = '';
//       self.dishName = '';
//       self.addedDish = true;
//       self.previousDish = name;
//     };

//     self.logout = appFactory.logout;

//   }

// })();
