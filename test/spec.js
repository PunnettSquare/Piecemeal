// JASMINE TESTS
// Notes: May need to comment out calculateRunningTotal in addDish.factory to get this to work
// run with karma start karma.conf.js

beforeEach(module('Piecemeal'));

describe('Piecemeal', function() {

  var $controller;
  var addDishFactoryMock = {
    calculateRunningTotal: function (data) {
      return _.filter(data.dishes, function(obj, key) {
          return _.contains(obj.users, appFactoryMock.getSessStorage('user_id'));
        })
        .reduce(function(acc, current) {
          console.log("calculateRunningTotal. acc: ", acc); 
          console.log("calculateRunningTotal. current: ", current); 
          return acc + (Number(current.cost) / current.users.length);
        }, 0);
    }
  };
  var appFactoryMock = {
        getSessStorage: function (prop) {
          if (prop === "user_id") {
            return 8; // jackson, not host
          }
        },
        initListeners : function() {},
        arrayToSentence: function (array) {
          array = _.map(array, _.capitalize);
          if (array.length === 1) {
            return array[0];
          }
          if (array.length === 2) {
            return array.join(" and ");
          } else {
            var last = array.pop();
            return array.join(", ") + " and " + last;
          }
        },
        shareDish: function () {},
        getDishIndivCost: function (dish) {
          return dish.cost / dish.users.length;
        },
        data: {
          billData: {
            code: "bread",
            event_id: 3,
            grandTotal: 47.8,
            hostUsername: "fawn",
            host_id: 7,
            subTotal: 18,
            taxPercent: 10,
            taxSum: 19.8,
            tipPercent: 10,
            tipSum: 19.8
          },
          code: "bread",
          dishes: [{
            cost: 8,
            dish_id: 5,
            name: "ramen",
            user_id: 7,
            users: [7, 8]
          }, {
            cost: 10,
            dish_id: 6,
            name: "burger",
            user_id: 8,
            users: [8]
          }],
          event_id: 3,
          users: [{
            dishes: [{
              cost: 8,
              dish_id: 5,
              name: "ramen",
              user_id: 7,
              users: [7, 8]
            }],
            host: true,
            id: 7,
            status: true,
            username: "fawn"
          }, {
            dishes: [{
              cost: 8,
              dish_id: 5,
              name: "ramen",
              user_id: 7,
              users: [7, 8]
            }, {
              cost: 10,
              dish_id: 6,
              name: "burger",
              user_id: 8,
              users: [8]
            }],
            host: false,
            id: 8,
            status: false,
            username: "jackson"
          }]
        }
      };

  var scopeMock = {
    $on: function () {}
  };

  beforeEach(inject(function(_$controller_, $rootScope){
    // Angular mock injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    socketMock = new sockMock($rootScope);
  }));

  describe('HostBillCtrl', function() {
    var controller, dishMock;

    beforeEach(function() {
      controller = $controller('HostBillCtrl', { $scope: scopeMock, socketFactory: socketMock, appFactory: appFactoryMock});

      // can optionally use dishMock instead of appFactoryMock.data.dishes[0] below for simplicity
      // dishMock = {
      //   cost: 8,
      //   users: [7, 8]
      // };
    });

    it('should return the individual\'s cost for a dish', function() { // move to appFactory spec
      expect(controller.getDishIndivCost(appFactoryMock.data.dishes[0])).toEqual(4);
    });

    it('should return subtotal for all dishes (not counting tax/tip)', function() {
      expect(controller.getSubTotal(controller.data.dishes)).toEqual(18);
    });
  });

  describe('GuestBillCtrl', function() {
    var controller;
    var guestsDishes;

    beforeEach(function() {
      controller = $controller('GuestBillCtrl', { $scope: scopeMock, socketFactory: socketMock, appFactory: appFactoryMock, addDishFactory: addDishFactoryMock});
    });

    it("should get Guest's dishes", function() {
      guestsDishes = controller.getGuestDishes(controller.user_id, controller.data.dishes);
      expect(guestsDishes.length).toEqual(2);
    });

    it("should show other users sharing this dish", function() {
      expect(controller.getOtherUsersByUsername(guestsDishes[0], controller.data.users, controller.user_id)).toEqual('Fawn');
    });

    it("should calculate user's current total", function() { // actually in addDishFactory
      expect(controller.getGuestTotal(controller.data)).toEqual(14);
      
    });

  });


  describe('AddDishCtrl', function() {
    var controller, addDishFactory;

    beforeEach(function() {
      addDishFactory = {
        calculateRunningTotal: function () {}
      };
      appFactory = {
        getSessStorage: function () {},
        initListeners : function() {},
        shareDish: function () {}
      };

      controller = $controller('AddDishCtrl', { $scope: scopeMock, socketFactory: socketMock, addDishFactory: addDishFactory, appFactory: appFactory});
    });

    it('should emit "addDish" and a dish object', function() {
      controller.addDish("ramen", 10);
      var testReceived = false;

      // Hacky way to check and update testReceived. socketMock.on can be used for the same thing once functional
      if (socketMock.emits["addDish"].name === "ramen" && socketMock.emits["addDish"].cost === 10) {
        testReceived = true;
      }

      expect(testReceived).toBe(true);
    });

  });

  describe('AllDishesCtrl', function() {

    var controller;

    beforeEach(function() {
      controller = $controller('AllDishesCtrl', { $scope: scopeMock, socketFactory: socketMock, appFactory: appFactoryMock});
    });

    it('listens for "joined"', function() {
    });

    // Bug: currently incorrectly returning 'false' instead of 'true':
    // it('.shareDish emits "shareDish" with a dish object', function() {
    //   controller.shareDish("burger", 10);
    //   var testReceived = false;

    //   // Hacky way to check and update testReceived. socketMock.on can be used for the same thing once functional
    //   if (socketMock.emits["shareDish"].name === "Burger" && socketMock.emits["shareDish"].cost === 10) {
    //     testReceived = true;
    //   }

    //   expect(testReceived).toBe(true);
    // });

    it('.unshareDish emits "unshareDish" with a dish object', function() {
    });

  });
});
/*
Mock for socket.io
see: https://github.com/btford/angular-socket-io-seed/issues/4
https://github.com/hackify/hackify-server/blob/master/test/controllers.test.js
https://github.com/nullivex/angular-socket.io-mock
*/
// When finished with tests, move this out of global scope, and into the Piecemeal describe block at top
var sockMock = function($rootScope){
  this.events = {};
  this.emits = {};

  this.init = function() {
    console.log("sockMock init");
  };

  // intercept 'on' calls and capture the callbacks
  this.on = function(eventName, callback){
    console.log("socketMock hears eventName: ", eventName); 
    console.log("socketMock listener has this callback: ", callback); // to see whole callback: callback.toString()

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    callback(this.emits[eventName]);
    
    console.log("socketMock has updated this.events to: ", this.events); 
    console.log('passing socketMock.emits[eventName] to callback in this.on: ', this.emits[eventName]); 
  };

  // intercept 'emit' calls from the client and record them to assert against in the test

    this.emit = function(eventName, data){
      // console.log("socketMock is emitting! eventName: ", eventName); 
      // console.log("socketMock is emitting this data: ", data); 

    // cut original code:
    // if(this.events[eventName]){
    //   angular.forEach(this.events[eventName], function(callback){
    //     $rootScope.$apply(function() {
    //       callback(data);
    //     });
    //   });
    // };

    this.emits[eventName] = data;
    // console.log('socketMock.emits["addDish"] is: ', socketMock.emits["addDish"]); 
  }

  //simulate an inbound message to the socket from the server (only called from the test)
  this.receive = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(this.events[eventName]){
      angular.forEach(this.events[eventName], function(callback){
        $rootScope.$apply(function() {
          callback.apply(this, args);
        });
      });
    };
  };

};

  // socketMock test format:

  // it("emits and receives messages", function(){
  //   var testReceived = false;

  //   socket.on("test", function(data){
  //     testReceived = true;
  //   });

  //   socket.emit("test", { info: "test" });
  //   expect(testReceived).toBe(true);
  // });

/*
// ANGULAR EXAMPLE
describe('PasswordController', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.grade', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('PasswordController', { $scope: scopeMock });
    });

    it('sets the strength to "strong" if the password length is >8 chars', function() {
      $scope.password = 'longerthaneightchars';
      $scope.grade();
      expect($scope.strength).toEqual('strong');
    });

    it('sets the strength to "weak" if the password length <3 chars', function() {
      $scope.password = 'a';
      $scope.grade();
      expect($scope.strength).toEqual('weak');
    });
  });
});

// ANGULAR EXAMPLE - w/ SERVICE

// Defined out reference variable outside
var myService;

// Wrap the parameter in underscores
beforeEach( inject( function(_myService_){
  myService = _myService_;
}));

// Use myService in a series of tests.
it('makes use of myService', function() {
  myService.doStuff();
});

// Sources: https://docs.angularjs.org/api/ngMock/function/angular.mock.inject
https://docs.angularjs.org/guide/unit-testing

// SIMPLE EXAMPLE
describe(‘Hello World example ’, function() {

beforeEach(module(‘myApp’));

var HelloWorldController,
scope;

beforeEach(inject(function ($rootScope, $controller) {
scope = $rootScope.$new();
HelloWorldController = $controller('HelloWorldController', {
$scope: scope
});
}));
it('says hello world!', function () {
expect(scope.greeting).toEqual("Hello world!");
});

});

//SIMPLE EXAMPLE PART II
describe('Calculator ', function() {

// necessary
it('should add two numbers correctly', function() {});
it('should subtract two numbers correctly', function() {});

// helpful but not needed
it('should add negative numbers', function() { });
it('should reject non numbers', function() { });
});

https://github.com/karma-runner/karma-jasmine
later: https://github.com/karma-runner/grunt-karma and http://www.sitepoint.com/testing-javascript-jasmine-travis-karma/
if server side testing with node: https://www.npmjs.com/package/jasmine-node-karma OR browserify OR requireJS
*/
