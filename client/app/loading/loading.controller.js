// # Loading Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: TODO

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = ['$location', '$window', 'loadingFactory', '$timeout', 'usersList', 'appFactory'];

  // **Parameters:** TODO

  function LoadingCtrl($location, $window, loadingFactory, $timeout, usersList, appFactory) {
    var self = this;
    self.currentUsers = _.uniq(_.pluck(usersList.data, 'username'));
    self.code = $window.location.hash.split("/")[1];

    self.setSessionUser = function(username) {
      $window.localStorage.code = $window.location.hash.split("/")[1];
      loadingFactory.sendSessionUser(
          _.assign($window.localStorage, {
            isHost: false,
            username: username,
          }))
        .then(function(userInfo) {
          _.assign($window.localStorage, {
            user_id: userInfo.user_id,
            event_id: userInfo.event_id
          });
          self.isSent = true;
          $location.path('/' + $window.localStorage.code + '/allDishes');
        })
        .catch(function(err) {
          console.log("Error: Could not send session user info.");
          console.error(err);
          self.isError = true;
          $timeout(function() {
            // appFactory.logout();
          }, 2000);
        });
    };
  }
})();
