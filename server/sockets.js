// # Socket Connection Handler

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Initialize Socket listeners and emitters on server-side. This entire socket connect handler is used only on POST requests for wildcard /* (i.e., room names).

var util = require('./utility');
var db = require('../db/db');

var connect = function(eventUrl, eventInfo, io, userObj) {
  // Set the Socket.io namespace to the eventUrl.

  var mealEvent = io.of(eventUrl);
  mealEvent.once('connection', function(socket) {

    //  Manual heartbeat to reconnect mobile devices after long period of no use
    //  Built in socket.io version wasn't cutting it
    setInterval(function() {
      socket.emit('ping');
    }, 1500);

    socket.on('pong', function() {
      // part of heartbeat - may not be necessary
    });

    console.log('Socket connection made with server: User', userObj.id, "socket id", socket.id, "on event URL", eventUrl);

    socket.emit('joined', eventInfo);

    socket.broadcast.emit('newParticipant', userObj);

    socket.on('addDish', function(data) {
      console.log("Server heard: AddDish", data.name, "with cost", data.cost);

      util.createDish(db, data.name, Number(data.cost), parseInt(data.user_id), parseInt(data.event_id))
        .then(function(dishIdObj) {
          mealEvent.emit('dishAdded', {
            cost: data.cost,
            name: data.name,
            user_id: parseInt(data.user_id),
            dish_id: dishIdObj.dish_id[0],
            users: data.users
          });
        })
        .catch(function(err) {
          throw err;
        });
    });

    socket.on('shareDish', function(data) {
      console.log("Server heard: ShareDish with dish ID", data.dish_id, "user ID", data.user_id);
      socket.broadcast.emit('dishShared', {
        user_id: data.user_id,
        dish_id: data.dish_id,
        firstShare: data.firstShare
      });
      util.shareDish(db, data.user_id, data.dish_id)
        .catch(function(err) {
          throw err;
        });
      //TODO: handle second share differently
    });

    socket.on('unshareDish', function(data) {
      console.log("Server heard: UnshareDish with dish ID", data.dish_id, "user ID", data.user_id);
      socket.broadcast.emit('dishUnshared', {
        user_id: data.user_id,
        dish_id: data.dish_id
      });
      util.unshareDish(db, data.user_id, data.dish_id)
        .catch(function(err) {
          throw err;
        });
    });

    socket.on('sendBillToGuests', function(data) {
      console.log("Server heard: SendBillToGuests with tip", data.tipPercent, "and tax", data.taxPercent, " and fee ", data.feePercent, " and discount ", data.discountPercent);
      socket.broadcast.emit('billsSentToGuests', data);

      util.addTipAndTax(db, data.event_id, data.taxPercent, data.tipPercent, data.feePercent, data.discountPercent, data.billSent)
        .catch(function(err) {
          throw err;
        });
    });
  });
};

// Required by [server.js](./server.html)
module.exports = connect;
