// (function() {
//   'use strict';

//   angular.module('Piecemeal')
//     .factory('addDishFactory', addDishFactory);

//   addDishFactory.$inject = ['appFactory'];

//   function addDishFactory(appFactory) {
//     var services = {
//       calculateRunningTotal: calculateRunningTotal
//     };

//     return services;

//     function calculateRunningTotal(data) {
//       // Initialize to 0 if appFactory.data hasn't loaded yet
//       return (!data) ? 0 : _.filter(data.dishes, function(obj, key) {
//           return _.contains(obj.users, appFactory.getSessStorage('user_id'));
//         })
//         .reduce(function(acc, current) {
//           return acc + (Number(current.cost) / current.users.length);
//         }, 0);
//     }
//   }
// })();
