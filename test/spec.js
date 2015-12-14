// JASMINE TESTS
// Notes: May need to comment out calculateRunningTotal in addDish.factory to get this to work
// run with karma start karma.conf.js

beforeEach(module('Piecemeal'));
var $controller;
var appFactoryMock = {
      getSessStorage: function () {},
      initListeners : function() {},
      shareDish: function () {},
      getDishIndivCost: function (dish) {
        return dish.cost / dish.users.length;
      },
      data: {
        billData: {},
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

beforeEach(inject(function(_$controller_, $rootScope){
  // Angular mock injector unwraps the underscores (_) from around the parameter names when matching
  $controller = _$controller_;
  socketMock = new sockMock($rootScope);
}));

describe('HostBillCtrl', function() {
  var $scope, controller, dishMock;

  beforeEach(function() {
    $scope = {};
    controller = $controller('HostBillCtrl', { $scope: $scope, socketFactory: socketMock, appFactory: appFactoryMock});

    // can optionally use dishMock instead of appFactoryMock.data.dishes[0] below for simplicity
    // dishMock = {
    //   cost: 8,
    //   users: [7, 8]
    // };
  });

  it('should return the individual\'s cost for a dish', function() {
    expect(controller.getDishIndivCost(appFactoryMock.data.dishes[0])).toEqual(4);
  });

  it('should return subtotal for all dishes (not counting tax/tip)', function() {
    expect(controller.getSubTotal(controller.data.dishes)).toEqual(18);
  });
});

describe('GuestBillCtrl', function() {
  var $scope, controller;

  beforeEach(function() {
    $scope = {};
    controller = $controller('GuestBillCtrl', { $scope: $scope, socketFactory: socketMock});
  });

  // it('has the property "test" which equals "test"', function() {
  //   expect(controller.test).toEqual('test');
  // });

});


describe('AddDishCtrl', function() {
  var $scope, controller, addDishFactory;

  beforeEach(function() {
    $scope = {};
    addDishFactory = {
      calculateRunningTotal: function () {}
    };
    appFactory = {
      getSessStorage: function () {},
      initListeners : function() {},
      shareDish: function () {}
    };

    controller = $controller('AddDishCtrl', { $scope: $scope, socketFactory: socketMock, addDishFactory: addDishFactory, appFactory: appFactory});
  });

  it('.test should equal "test"', function() {
    expect(controller.test).toEqual('test');
  });
  
  // Bug: currently incorrectly returning 'false' instead of 'true':
  it('AddDishCtrl.addDish should emit "addDish" and a dish object', function() {
    controller.addDish("ramen", 10);
    var testReceived = false;

    // Hacky way to check and update testReceived. socketMock.on can be used for the same thing once functional
    if (socketMock.emits["addDish"].name === "ramen" && socketMock.emits["addDish"].cost === 10) {
      testReceived = true;
    }

    expect(testReceived).toBe(true);
  });

  it("should calculate user's current total", function() {

  });


});

describe('AllDishesCtrl', function() {

  var $scope, controller;

  beforeEach(function() {
    $scope = {
      $on: function () {
        console.log("mock $scope .on"); 
      }
    };

    controller = $controller('AllDishesCtrl', { $scope: $scope, socketFactory: socketMock, appFactory: appFactoryMock});
  });

  it('has the property "test" which equals "test"', function() {
    // expect(controller.test).toEqual('test'); // put self.test on controller to verify it's working
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

/*
Mock for socket.io
see: https://github.com/btford/angular-socket-io-seed/issues/4
https://github.com/hackify/hackify-server/blob/master/test/controllers.test.js
https://github.com/nullivex/angular-socket.io-mock
*/
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
      controller = $controller('PasswordController', { $scope: $scope });
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
