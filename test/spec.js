// JASMINE TESTS
// Notes: May need to comment out calculateRunningTotal in addDish.factory to get this to work

describe('AllDishesCtrl', function() {
  beforeEach(module('Piecemeal'));

  var $controller;

  beforeEach(inject(function(_$controller_, $rootScope){
    // Angular mock injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    socketMock = new sockMock($rootScope);
  }));

  describe('HostReceiptCtrl', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('HostReceiptCtrl', { $scope: $scope, socketFactory: socketMock, serverState:{roomName:'testRoom'}});
    });

    it('has the property "test" which equals "test"', function() {
      expect(controller.test).toEqual('test');
    });

  });


  describe('AddDishCtrl', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {};
      controller = $controller('AddDishCtrl', { $scope: $scope, socketFactory: socketMock, serverState:{roomName:'testRoom'}});
    });

    it('.test should equal "test"', function() {
      expect(controller.test).toEqual('test');
    });
    
    it('AddDishCtrl.addDish should emit "addDish"', function() {
      controller.addDish("ramen", 10);
      var testReceived = false;

      // Hacky way to check and update testReceived
      if (socketMock.emits["addDish"].name === "Ramen" && socketMock.emits["addDish"].cost === 10) {
        testReceived = true;
      }

      // Original, but not necessary way to check and update testReceived is to use socketMock.on
      // socketMock.on("addDish", function(data){
      //   console.log("socketMock.on callback is receiving this data: ", data);  // BUG data = undefined
      //   if (data.cost === 10 && data.name === "ramen") { //socketmock. .... .data
      //     return true;
      //   } else {
      //     return false;
      //   }
      // });
      // testReceived = socketMock.events["addDish"][0]("addDish"); // can remove

      expect(testReceived).toBe(true);
    });

    // it('AddDishCtrl.addDish should emit a dish object', function() {
    //   expect($scope.test).toEqual('test');
    // });

    // working socketMock test:
    // it("emits and receives messages", function(){
    //   var testReceived = false;

      // socketMock.on("addDish", function(data){
      //   if (data.cost === 10 && data.name === "Ramen") {
      //     testReceived = true;
      //   }
      //   console.log("testReceived: ", testReceived); 
      // });

    //   socketMock.emit("addDish", {
    //     cost: 10,
    //     name: "Ramen",
    //     user_id: window.sessionStorage.user_id,
    //     event_id: window.sessionStorage.event_id,
    //     users: [window.sessionStorage.user_id]
    //   });
    //   console.log("socketMock.events: ", socketMock.events); 
    //   console.log("socketMock.emits: ", socketMock.emits); 
    //   expect(testReceived).toBe(true);
    // });

    // socketMock test format:
    // it("emits and receives messages", function(){
    //   var testReceived = false;

    //   socket.on("test", function(data){
    //     testReceived = true;
    //   });

    //   socket.emit("test", { info: "test" });
    //   expect(testReceived).toBe(true);
    // });

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
