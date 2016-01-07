// # Home Controller

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Check if user is logged into Venmo, and if so, show logged out button.

(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$window', 'homeFactory', '$location'];

  // **Parameters:** TO DO

  function HomeCtrl($window, homeFactory, $location) {

    var self = this;
    self.isVenmo = $window.localStorage.venmoUsername;

    self.incorrectCode = false;

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

    self.setSessionUser = function(code) {
      code = code.toLowerCase();
      homeFactory.checkCode(code.toLowerCase())
        .then(function(validCode) {
          if (validCode.data.isValid) {
            _.assign($window.localStorage, {
              code: code,
              isHost: false
            });
            //check if user has recently authenticated with venmo
            if ($window.localStorage.venmoUsername) {
              //if so send them directly into room, using their stored username
              $window.localStorage.event_id = validCode.data.id;
              $location.path('/' + code + '/allDishes');
            } else {
              $location.path('/' + $window.localStorage.code + '/loading');
            }
          } else {
            Materialize.toast('Your entered room does not exist. <br>Please try again.', 4000);
          }
        });
    };

    self.oAuth = function() {
      // check if venmousername is defined
      if ($window.localStorage.venmoUsername) {
        //if so, create room for the user immidiately and move them to all dishes
        var userInfo = {
          id: $window.localStorage.user_id,
          username: $window.localStorage.username
        };
        homeFactory.createEvent(userInfo)
          .then(function(data) {
            data = data.data;
            _.assign($window.localStorage, {
              code: data.code,
              isHost: true,
              event_id: data.event_id
            });
            $location.path('/' + data.code + '/allDishes');
          })
          .catch(function(err) {
            console.log("Error in creating event.");
          });
      } else {
        // otherwise send them to the oAuth page via $location.path('/oAuth');
        $location.path('/oAuth');
      }
    };

    self.logoutVenmo = function() {
      $window.localStorage.clear();
      self.isVenmo = false;
      $window.location.reload();
    };

  }
})();
