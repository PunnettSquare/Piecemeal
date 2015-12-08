(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory', '$window', '$location'];

  function HomeCtrl(homeFactory, $window, $location) {

    var self = this;

    // window.sessionStorage should have: username, user_id, event code, event_id, and isHost
    self.setSessionUser = function(username, isHost, code) {
      window.sessionStorage.setItem('username', username);
      window.sessionStorage.setItem('isHost', true);

      if (isHost) {
        homeFactory.createEvent({
            username: username
          })
          .then(function(data) {
            window.sessionStorage.setItem('code', data.code);
            $location.path('/' + data.code + '/allDishes');
            window.location.reload(true);
          })
          .catch(function(err) {
            console.log("Error in creating event.");
          });
      } else {
        code = code || 'testRoom'; // just mock data - add functionality later that the user *must* enter a test room
        window.sessionStorage.setItem('code', code);
        window.sessionStorage.setItem('isHost', false);

        homeFactory.sendSessionUser(window.sessionStorage)
          .then(function(userInfo) {
            window.sessionStorage.setItem('user_id', parseInt(userInfo.user_id));
            window.sessionStorage.setItem('event_id', parseInt(userInfo.event_id));
            $location.path('/' + code + '/allDishes');
            window.location.reload(true);
          })
          .catch(queryFail);
      }
    };

    function queryFail(err) {
      console.error('Query Failed',
        err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
        err);
    }
  }
})();
