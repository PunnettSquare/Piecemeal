(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory', 'socket', '$window'];

  function HomeCtrl(homeFactory, $window, socket) {
    var self = this;

    self.setSessionUser = function(username, isHost, roomname) {
      window.sessionStorage.setItem('username', username);
      if (isHost) {
        self.sendSessionUser(_.assign(sessionStorage, {
          'isHost': true
        }));
        $window.location.href = '/createEvent';
      } else {
        self.sendSessionUser(_.assign(sessionStorage, {
          'isHost': false
        }));
        $window.location.href = '/' + roomname;
      }
    };

    self.sendSessionUser = function(username) {
      homeFactory.sendSessionUser(username)
        .then(function(userInfo) {
          self.userId = userInfo.id;
          self.username = userInfo.username;
          console.log("Successfully received userInfo", userInfo);
        })
        .catch(queryFail);
    };

    //start testing socket
    self.socketmessage = "test";

    socket.on('join', function(data) {
      console.log("receiving data for join");
      self.socketmessage = "data: " + data;
    });
    //end test

    function queryFail(err) {
      console.error('Query Failed',
        err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
        err);
    }
  }
})();
