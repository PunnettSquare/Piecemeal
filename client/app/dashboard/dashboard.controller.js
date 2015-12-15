(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('DashboardCtrl', DashboardCtrl);

  DashboardCtrl.$inject = ['dashboardFactory', '$window', '$location'];

  function DashboardCtrl(dashboardFactory, $window, $location) {
    var self = this;
    dashboardFactory.createEvent()
    .then(function(data) {
      data = data.data;
      console.log('data in dashboard', data);
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
