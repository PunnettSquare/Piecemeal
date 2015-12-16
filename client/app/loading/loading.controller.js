(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('LoadingCtrl', LoadingCtrl);

  LoadingCtrl.$inject = ['$location', '$window', 'loadingFactory'];

  function LoadingCtrl($location, $window, loadingFactory) {
    var self = this;
    var code = $window.location.hash.split("/")[1].toLowerCase();

    self.setSessionUser = function(username) {
      loadingFactory.sendSessionUser(
          _.assign($window.sessionStorage, {
            username: username
          }))
        .then(function(userInfo) {
          _.assign($window.sessionStorage, {
            user_id: userInfo.user_id,
            event_id: userInfo.event_id
          });
          self.isSent = true;
          // setTimeout(function() {
            // window.location.hash = "#/" + code + "/allDishes"
          // }, 100);
        })
        .catch(function(err) {
          console.log("Error: Could not send session user info.");
          console.error(err);
          self.isError = true;
        });

    };
  }

})();
