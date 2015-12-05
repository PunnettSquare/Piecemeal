(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory', 'socketFactory', '$window'];

  function HomeCtrl(homeFactory, socketFactory, $window) {

    var self = this;

    //start testing socketFactory
    self.socketmessage = "test";

    socketFactory.on('join', function(data) {
      console.log("receiving data for join");
      self.socketmessage = "data: " + data;
    });
    // end test

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
        window.sessionStorage.setItem('code', roomname);
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


    function queryFail(err) {
      console.error('Query Failed',
        err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
        err);
    }
  }
})();
