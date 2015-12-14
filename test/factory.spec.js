// SERVICE TEST
beforeEach(module('Piecemeal'));

// Wrap the parameter in underscores

describe('Piecemeal', function() {
  
  var myFactory;
  var appFactory;

  beforeEach( inject( function(_appFactory_, $rootScope){
    appFactory = _appFactory_;
    socketMock = new sockMock($rootScope);
  }));
  
  describe('appFactory', function() {

    // bug, not sure how to inject sockMock here
    // beforeEach(function() {
    //   appFactory = appFactory('appFactory', { socketFactory: socketMock});
    // });

    // add test property equal to "test" in appFactory if want to use this
    // it('makes use of myFactory', function() {
    //   expect(appFactory.test).toEqual('test');
    // });

    // it('initates listeners', function() {
    //   expect(appFactory.test).toEqual('test');
    // });

  });
});

var sockMock = function($rootScope){
  this.events = {};
  this.emits = {};

  this.init = function() {
    console.log("sockMock init");
  };

  // intercept 'on' calls and capture the callbacks
  this.on = function(eventName, callback){

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    callback(this.emits[eventName]);
    
  };

  // intercept 'emit' calls from the client and record them to assert against in the test
  this.emit = function(eventName, data){
    this.emits[eventName] = data;
  }

};
