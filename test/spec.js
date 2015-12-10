// JASMINE

describe('AllDishesCtrl', function() {
  beforeEach(module('Piecemeal'));

  var $controller;

  beforeEach(inject(function(_$controller_, $rootScope){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_; //ngMock thing, optional
    socketMock = new sockMock($rootScope);
  }));

  describe('$scope.test', function() {
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

    it('AddDishCtrl.test should equal "test"', function() {
      expect(controller.test).toEqual('test');
    });

    // it('AddDishCtrl.addDish should emit "addDish"', function() {
    //   expect(controller.addDish).toEqual('test');
    // });

    // it('AddDishCtrl.addDish should emit a dish object', function() {
    //   expect($scope.test).toEqual('test');
    // });

    // it("emits and receives messages", function(){
    //   var testReceived = false;

    //   socketMock.on("addDish", function(data){
    //     testReceived = true;
    //   });

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
Simple mock for socket.io
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
    if(!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  };

  // intercept 'emit' calls from the client and record them to assert against in the test
  this.emit = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(!this.emits[eventName])
      this.emits[eventName] = [];
    this.emits[eventName].push(args);
  };

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
