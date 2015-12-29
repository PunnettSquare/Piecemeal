(function() {
  'use strict';

  angular.module('Piecemeal')
  .controller('OAuthCtrl', OAuthCtrl);

  OAuthCtrl.$inject = ['oAuthFactory', '$window', '$location'];


  function OAuthCtrl(oAuthFactory, $window, $location) {
    var self = this;

    // $window.localStorage should have: username, user_id, event code, event_id, and isHost
    self.setSessionUser = function(username, isHost, code) {
      oAuthFactory.createEvent({
          username: username
        })
        .then(function(data) {
          _.assign($window.localStorage, {
            username: username,
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
    };
    
  }

})();
