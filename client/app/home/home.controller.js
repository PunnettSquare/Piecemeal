(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['homeFactory'];

  function HomeCtrl(homeFactory) {
    var self = this;

    self.setSessionUser = function(username) {
      window.sessionStorage.setItem('username', username);
      self.sendSessionGuest(window.sessionStorage);

    };

    self.sendSessionGuest = function(username) {
      homeFactory.sendSessionUser(_.assign(username, {
          'isHost': false
        }))
        .then(function(userInfo) {
          self.userId = userInfo.id;
          self.username = userInfo.username;
          console.log("Successfully received userInfo", userInfo);
        })
        .catch(function(err) {
          console.log("Didn't receive guest id");
        });
    };

    // self.sendSessionHost = function(username) {
    //   homeFactory.sendSessionUser(_.assign(username, {
    //       'isHost': true
    //     }))
    //     .then(function(userInfo) {
    //       self.userId = userInfo.userId;
    //       self.username = userInfo.username;
    //     })
    //     .catch(function(err) {
    //       console.log("Didn't receive id");
    //     });
    // };

    function queryFail(err) {
      console.error('Query Failed',
        err.data.replace(/<br>/g, '\n').replace(/ &nbsp;/g, '>'),
        err);
    }
  }
})();
