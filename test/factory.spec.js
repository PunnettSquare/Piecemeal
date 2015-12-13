// SERVICE TEST
beforeEach(module('Piecemeal'));

// Wrap the parameter in underscores

describe('appFactory', function() {
  
  var myFactory;

  beforeEach( inject( function(_myFactory_){
    myService = _myFactory_;
  }));

  var factory;

  beforeEach(function() {
    factory = myService('appFactory', { socketFactory: socketMock });
  });

  // Use myService in a series of tests.
  it('makes use of myService', function() {
    // myService.doStuff();
  });
});
