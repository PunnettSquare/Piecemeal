// SERVICE TEST
beforeEach(module('Piecemeal'));

// Wrap the parameter in underscores

describe('app', function() {
  
  var myFactory;
  var appFactory;

  beforeEach( inject( function(_appFactory_){
    appFactory = _appFactory_;
  }));
  
  describe('appFactory', function() {

    // add test property equal to "test" in appFactory if want to use this
    // it('makes use of myFactory', function() {
    //   expect(appFactory.test).toEqual('test');
    // });
  });
});
