(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$window', 'homeFactory', '$location'];

  function HomeCtrl($window, homeFactory, $location) {

    var self = this;

    self.incorrectCode = false;

    self.setSessionUser = function(code) {
      homeFactory.checkCode(code.toLowerCase())
      .then(function(validCode) {
        if (validCode.data) {
          _.assign($window.localStorage, {
            code: code.toLowerCase(),
            isHost: false
          });
          $location.path('/' + $window.localStorage.code + '/loading');
        } else {
          self.incorrectCode = true;
        }
      });
    };
    self.oAuth = function () {
      // check if venmousername is defined
      if ($window.localStorage.venmoUsername) {
        //if so, create room for the user immidiately and move them to all dishes
        var userInfo = {
          id: $window.localStorage.user_id,
          username: $window.localStorage.username
        }
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
    }

  }
})();
