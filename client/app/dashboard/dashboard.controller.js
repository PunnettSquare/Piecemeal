(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['dashboardFactory', '$window', '$location', 'appFactory'];

  function DashboardCtrl(dashboardFactory, $window, $location, appFactory) {
    var self = this;

    self.getUsers = function(users) {
      return appFactory.arrayToSentence(users.map(function(userObj) {
        return userObj.username;
      }));
    };

    self.getDishNames = function(bill) {
      return appFactory.arrayToSentence(bill.dishes.map(function(dish) {
        return dish.name;
      }));
    }

    // dashboardFactory.getBills()
    // .then(function(data) {
    //   self.allBills = data.data;
    //   console.log(data);
    // })

    dashboardFactory.createEvent()
    .then(function(data) {
      data = data.data;
      _.assign($window.sessionStorage, {
        username: data.username,
        code: data.code,
        isHost: true,
        user_id: data.user_id,
        event_id: data.event_id
      });
      $location.path('/' + data.code + '/allDishes');
    })
    .catch(function(err) {
      console.log("Error in creating event.");
    });
  }

})();
