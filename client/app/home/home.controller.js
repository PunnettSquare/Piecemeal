(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory', '$window', '$location'];

  function HomeCtrl(homeFactory, $window, $location) {

    var self = this;

    // window.sessionStorage should have: username, user_id, event code, event_id, and isHost
    self.setSessionUser = function(username, isHost, code) {
      if (isHost) {
        homeFactory.createEvent({
            username: username
          })
          .then(function(data) {
            _.assign(window.sessionStorage, {
              username: username,
              code: data.code,
              isHost: true
            });
            $location.path('/' + data.code + '/allDishes');
          })
          .catch(function(err) {
            console.log("Error in creating event.");
          });
      } else {
        // code = code || 'testRoom'; // only for mock data
        homeFactory.sendSessionUser(
            _.assign(window.sessionStorage, {
              username: username,
              code: code,
              isHost: false
            }))
          .then(function(userInfo) {
            _.assign(window.sessionStorage, {
              user_id: userInfo.user_id,
              event_id: userInfo.event_id
            });
            $location.path('/' + code + '/allDishes');
          })
          .catch(function(err) {
            console.log("Error: Could not send session user info.");
            console.error(err);
            self.isError = true;
          });

      }
    };

    // function queryFail(err) {
    //   console.error('Query Failed',
    //     err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
    //     err);
    // }
  }
})();
