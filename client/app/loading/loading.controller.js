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

    //check for Safari private mode
    try {
      $window.localStorage.checkPrivateMode = 'not private';
    } catch (e) {
      self.privateMode = true;
    }

    if (!self.privateMode) {
      $window.localStorage.checkPrivateMode = undefined;
    } else {
      Materialize.toast('Turn off Safari Private mode to continue');
    }

    self.setSessionUser = function(username) {
      loadingFactory.sendSessionUser({
          isHost: false,
          username: username,
          code: $window.location.hash.split("/")[1]
        })
        .then(function(userInfo) {
          _.assign($window.localStorage, {
            isHost: false,
            username: username,
            code: $window.location.hash.split("/")[1],
            user_id: userInfo.user_id,
            event_id: userInfo.event_id
          });
          self.isSent = true;
          $location.path('/' + $window.localStorage.code + '/allDishes');
        })
        .catch(function(err) {
          Materialize.toast('Your entered room does not exist. <br>Redirecting...', 2500);
          console.error("Error: Could not send session user info.", err);
          $timeout(function() {
            $location.path('/home');
          }, 2500);
        });
    };
  }
})();
