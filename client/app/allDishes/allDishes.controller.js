(function() {
  'use strict';

  angular.module('Piecemeal')
    .controller('AllDishesCtrl', AllDishesCtrl);

  AllDishesCtrl.$inject = ['socketFactory', 'allDishesFactory', '$location', '$window', '$scope'];

  function AllDishesCtrl(socketFactory, allDishesFactory, $location, $window, $scope) {

    var self = this;

    // join test
    socket.on('join', function(data) {
      console.log("receiving data for join");
    });

    // self.listOfMeals;

    // AppSocket.socket.on('join', function(data) {
    //   self.listOfMeals = data;
    //   console.log(data);
    // });

    // AppSocket.socket.on('dishAdded', function(data) {
    //   self.listOfMeals.push(data);
    // });

// join
// socketFactory.on('join', function(data) {
//   self.listOfMeals = data;
// });

// socketFactory.on('dishAdded', function(data) {
//   self.listOfMeals.push(data);
// });

    socketFactory.init();

    socketFactory.on('join', function(data) {
      console.log("receiving data for join", data);
      self.socketmessage = "data: " + data;
      $scope.data = data;
    });

    // added this to test sockets across different views
    self.goToAddDish = function () {
      $location.path('/' + $window.location.toString().split('/')[4] + '/addDish');
    }

    allDishesFactory.getEventInfo();
    // end test
    $scope.getId = function (arrayOfIds, eventInfo) {
      var usernames = arrayOfIds.map(function(id) {
        var result;
        eventInfo.users.forEach(function(user) {
          if (user.id === id) {
            result = user.username;
          }
        });
        if (result) {
          return result;
        }
      })
      return usernames.length === 1 ? usernames[0] : usernames.join(', ');
    }

    // db queries
    // input: username + id + event
    // outputs:
    // list of dishes & costs
    // how many people sharing dish

    // socket broadcast
    // remove meal
    // share meal

    // global listener (already on app.socket.init)
    // any added dishes from other people (in real time)

    // calculate:
    // filter total list for user-only dishes
    //  calculate cost of each shared dish by dividing by # of people sharing it
    // your total bill
    // dinner party total bill (reduce total list cost)
  }
})();



