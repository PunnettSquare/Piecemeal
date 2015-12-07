(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory', '$window', '$location'];

  function HomeCtrl(homeFactory, $window, $location) {

    var self = this;

    //start testing socketFactory
    // self.socketmessage = "test";

    // socketFactory.on('join', function(data) {
    //   console.log("receiving data for join", data);
    //   self.socketmessage = "data: " + data;
    // });
    // end test

    self.setSessionUser = function(username, isHost, code) {
      window.sessionStorage.setItem('username', username);

      if (isHost) {
        homeFactory.createEvent({
            username: self.username
          })
          .then(function(data) {
            // TODO store code, username, and userID and eventID possibly
            // store code here
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
        var userObj = _.assign(sessionStorage, {
          'isHost': false
        });

        homeFactory.sendSessionUser(userObj)
          .then(function(userInfo) {
            window.sessionStorage.setItem('user_id', userObj.user_id);
            window.sessionStorage.setItem('event_id', userObj.event_id);
            $location.path('/' + data.code + '/allDishes');
            window.location.reload(true);
          })
          .catch(function(err) {
            console.log("Error in logging in guest.");
          });

          // window.sessionStorage.setItem('code', code);
        // homeFactory.createUser({username: self.username});
        // $window.location.href = '/' + code;
      }
    };

    // self.sendSessionUser = function(username) {
    //   homeFactory.sendSessionUser(username)
    //     .then(function(userInfo) {
    //       self.userId = userInfo.id;
    //       self.username = userInfo.username;
    //       console.log("Successfully received userInfo", userInfo);
    //     })
    //     .catch(queryFail);
    // };


    // function queryFail(err) {
    //   console.error('Query Failed',
    //     err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
    //     err);
    // }
  }
})();
