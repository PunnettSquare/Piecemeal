(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = ['$location', '$window', 'loadingFactory', 'appFactory', '$timeout'];

  function LoadingCtrl($location, $window, loadingFactory, appFactory, $timeout) {
    var self = this;

    if (!$window.localStorage.getItem('code')) {
      var path = $location.path().split('/');
      $window.localStorage.setItem('code', path[path.length - 2]);
    }

    self.setSessionUser = function(username) {
      loadingFactory.sendSessionUser(
          _.assign($window.localStorage, {
            isHost: false,
            username: username
          }))
        .then(function(userInfo) {
          _.assign($window.localStorage, {
            user_id: userInfo.user_id,
            event_id: userInfo.event_id
          });
          self.isSent = true;
          $location.path('/' + $window.localStorage.code + '/allDishes');
          // $timeout(function() {
          //   window.location.hash = "#/" + code + "/allDishes";
          // }, 1000);
        })
        .catch(function(err) {
          console.log("Error: Could not send session user info.");
          console.error(err);
          self.isError = true;
          $timeout(function() {
            appFactory.logout();
          }, 2000);
        });
    };
  }
})();
