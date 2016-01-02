// # JASMINE TESTS
// Run with karma start karma.conf.js

beforeEach(module('Piecemeal'));

describe('Piecemeal', function() {

// Note: If wanted to test allDishes, would have to comment out jQuery leanModal method, or else get the spy below to function
  // spyOn($.fn, 'leanModal').and.returnValue("something");
  // spyOn($.fn, 'leanModal').and.callFake(function() {
  //   return 1001;
  // });

  // ## Mocks

  var $controller;

  var allDishesFactoryMock = {
    calculateRunningTotal: function(data) {
      return _.filter(data.dishes, function(obj, key) {
          return _.contains(obj.users, appFactoryMock.getSessStorage('user_id'));
        })
        .reduce(function(acc, current) {
          return acc + (Number(current.cost) / current.users.length);
        }, 0);
    }
  };

  var appFactoryMock = {
    initListeners: function() {},
    getSessStorage: function(prop) {
      if (prop === "user_id") {
        return 46; // not host
      }
    },
    checkCode: function () {},
    copySessData: function() {
      return appFactoryMock.data;
    },
    arrayToSentence: function(array) {
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
    shareDish: function() {},
    getDishIndivCost: function(dish) {
      return dish.cost / dish.users.length;
    },
    data: {
      billData: {
        billSent: true,
        discountPercent: 3.33,
        feePercent: 6.67,
        taxPercent: 10,
        tipPercent: 10
      //sent on finalization:
        // billSent: true,
        // code: "mints",
        // event_id: 36,
        // hostUsername: "fawn",
        // host_id: 45,
        // subTotal: 15,
        // taxPercent: 10,
        // tipPercent: 10,
        // feePercent: 6.67,
        // discountPercent: 3.33,
        // grandTotal: 18.5
      },
      code: "mints",
      dishes: [{
          cost: "10.00",
          dish_id: 25,
          email: null,
          event_id: 36,
          name: "ramen",
          phone: null,
          users: [45, 46]
        }, {
          cost: "5.00",
          dish_id: 26,
          email: null,
          event_id: 36,
          name: "hiahi",
          phone: null,
          users: [45, 46]
      }], 
      event_id: 36,
      users: [{ // first user
        host: true,
        id: 45,
        status: true,
        username: "fawn",
        venmoUsername: null,
        dishes: [{ 
              cost: "10.00",
              dish_id: 25,
              email: null,
              event_id: 36,
              id: 25,
              name: "ramen",
              phone: null,
              user_id: 46,
              username: "flor",
              venmoUsername: null,
              users: [45, 46]
            },{
              cost: "5.00",
              dish_id: 26,
              email: null,
              event_id: 36,
              name: "hiahi",
              phone: null,
              users: [45, 46]
        }]
      }, { // second user
        host: false,
        id: 46,
        status: false,
        username: "flor",
        venmoUsername: null,
        dishes: [{
              cost: "10.00",
              dish_id: 25,
              email: null,
              event_id: 36,
              id: 25,
              name: "ramen",
              phone: null,
              user_id: 46,
              username: "flor",
              venmoUsername: null
            }, {
              cost: "5.00",
              dish_id: 26,
              email: null,
              event_id: 36,
              id: 26,
              name: "hiahi",
              phone: null,
              user_id: 46,
              username: "flor",
              venmoUsername: null
        }]
      }]
    }
  };

  var scopeMock = {
    $on: function() {}
  };

  /* 
  Mock for socket.io. 
  Use later with AllDishesCtrl tests
  see: https://github.com/btford/angular-socket-io-seed/issues/4
  https://github.com/hackify/hackify-server/blob/master/test/controllers.test.js
  https://github.com/nullivex/angular-socket.io-mock
  */

  var sockMock = function($rootScope) {
    this.events = {};
    this.emits = {};

    this.init = function() {
      console.log("sockMock init");
    };

    // Intercept 'on' calls and capture the callbacks
    this.on = function(eventName, callback) {
      console.log("socketMock hears eventName: ", eventName);
      console.log("socketMock listener has this callback: ", callback); // To see whole callback, use callback.toString()

      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
      callback(this.emits[eventName]);

      console.log("socketMock has updated this.events to: ", this.events);
      console.log('passing socketMock.emits[eventName] to callback in this.on: ', this.emits[eventName]);
    };

    // Intercept 'emit' calls from the client and record them to assert against in the test
    this.emit = function(eventName, data) {
      this.emits[eventName] = data;
      console.log('socketMock.emits["shareDish"] is: ', socketMock.emits["shareDish"]);
    };
    // Simulate an inbound message to the socket from the server (only called from the test)
    this.receive = function(eventName) {
      var args = Array.prototype.slice.call(arguments, 1);

      if (this.events[eventName]) {
        angular.forEach(this.events[eventName], function(callback) {
          $rootScope.$apply(function() {
            callback.apply(this, args);
          });
        });
      }
    };

  };

// SocketMock test format:

// it("emits and receives messages", function(){
//   var testReceived = false;

//   socket.on("test", function(data){
//     testReceived = true;
//   });

//   socket.emit("test", { info: "test" });
//   expect(testReceived).toBe(true);
// });

  // ## Unit Tests

  beforeEach(inject(function(_$controller_, $rootScope) {
    // Angular mock injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    socketMock = new sockMock($rootScope);
  }));

  // Guest Bill Unit Tests

  describe('GuestBillCtrl', function() {
    var controller;
    var guestsDishes;

    beforeEach(function() {
      controller = $controller('GuestBillCtrl', {
        $scope: scopeMock,
        socketFactory: socketMock,
        appFactory: appFactoryMock,
        allDishesFactory: allDishesFactoryMock
      });
      controller.user_id = 46;
    });

    it("should get Guest's dishes", function() {
      guestsDishes = controller.getGuestDishes(controller.user_id, controller.data.dishes);
      expect(guestsDishes.length).toEqual(2);
    });

    it("should show other users sharing this dish", function() {
      expect(controller.getOtherUsersByUsername(guestsDishes[0], controller.data.users, controller.user_id)).toEqual('Fawn');
    });

    it("should calculate user's current total", function() {
      expect(controller.getGuestTotal(controller.data)).toEqual(7.5);
    });

  });

  // Host Bill Unit Tests

  describe('HostBillCtrl', function() {
    var controller;
    // Could use dishMock instead of appFactoryMock.data.dishes[0] for simplicity
    // var dishMock = {
    //     cost: "5.00",
    //     dish_id: 26,
    //     email: null,
    //     event_id: 36,
    //     name: "hiahi",
    //     phone: null,
    //     users: [45, 46]
    // };

    beforeEach(function() {
      controller = $controller('HostBillCtrl', {
        $scope: scopeMock,
        socketFactory: socketMock,
        appFactory: appFactoryMock
      });
      controller.tip = 1.5;
      controller.tipType.value = 'dollar';
      controller.tax = 1.5;
      controller.taxType.value = 'dollar';
      controller.fee = 1;
      controller.discount = 0.5;
    });

    it('should return the individual\'s portion of cost for a dish', function() { 
      expect(controller.getDishIndivCost(appFactoryMock.data.dishes[0])).toEqual(5);
    });

    it('should return subtotal for all dishes (not counting tax/tip)', function() {
      expect(controller.getSubTotal(controller.data.dishes)).toEqual(15);
    });

    it('should get tip as dollar amount', function () {
      expect(controller.getTip('dollar')).toEqual(1.5);
    });

    it('should calculate tip as a percent', function () {
      expect(controller.getTip('percent')).toEqual(10);
    });

    it('should get tax as dollar amount', function () {
      expect(controller.getTax('dollar')).toEqual(1.5);
    });

    it('should calculate tax as a percent', function () {
      expect(controller.getTax('percent')).toEqual(10);
    });

    it('should get fee', function () {
      expect(controller.fee).toEqual(1);
    });

    it('should get discount', function () {
      expect(controller.discount).toEqual(0.5);
    });

    it('should calculate grand total', function () {
      expect(controller.getGrandTotal()).toEqual(18.5);
      
    });

  });

// ## Insert new tests here

// To test AllDishes, need to comment out jQuery leanModal method, or use a spy, which doesn't currently work:
//   describe('AllDishesCtrl', function() {

//     var controller;
//     var dish;

//     beforeEach(function() {
//       controller = $controller('AllDishesCtrl', {
//         $scope: scopeMock,
//         socketFactory: socketMock,
//         appFactory: appFactoryMock
//       });
//       dish = controller.data.dishes[0];
//     });

//     it('should check to see if a user is on a dish', function() {
//       expect(controller.isOnDish(dish.users, 7)).toBe(true);
//     });

//     // Bug: currently incorrectly returning 'false' instead of 'true':
//     it('.shareDish emits "shareDish" with a dish object', function() {
//       controller.shareDish(1, 7, [1, 2]); // dish.dish_id, allDishes.user_id, dish.users

//       expect(socketMock.emits["shareDish"].dish_id).toBe(1);
//       expect(socketMock.emits["shareDish"].user_id).toBe(7);
//     });

//   });

// Move old AddDishCtrl tests (which include sockMock tests) into  AllDishCtrl tests when jQuery spy is done:

// describe('AddDishCtrl', function() {
//   var controller, allDishesFactory;
//   spyOn($.fn, 'leanModal').and.returnValue("something");

//   beforeEach(function() {
//     allDishesFactory = {
//       calculateRunningTotal: function() {}
//     };
//     appFactory = {
//       getSessStorage: function() {},
//       initListeners: function() {},
//       shareDish: function() {}
//     };

//     controller = $controller('AddDishCtrl', {
//       $scope: scopeMock,
//       socketFactory: socketMock,
//       allDishesFactory: allDishesFactory,
//       appFactory: appFactory
//     });
//   });

//   it('should emit "addDish" and a dish object', function() {
//     controller.addDish("ramen", 10);
//     var testReceived = false;

//     // Hacky way to check and update testReceived. socketMock.on can be used for the same thing once functional
//     if (socketMock.emits["addDish"].name === "ramen" && socketMock.emits["addDish"].cost === 10) {
//       testReceived = true;
//     }

//     expect(testReceived).toBe(true);
//   });

// });

});
