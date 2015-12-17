// # Socket Connection Handler
var util = require('./utility');
var db = require('../db/db');

var connect = function(eventUrl, eventInfo, io, userObj) {
  // Set the Socket.io namespace to the eventUrl.

  var mealEvent = io.of(eventUrl);
  mealEvent.once('connection', function(socket) {

    // socket.on('userAdded', function(user) {
    //   socket.broadcast.emit('userAdded', user);
    // });
    console.log('Socket connection made with server: User', userObj.id, "socket id", socket.id, "on event URL", eventUrl);

    socket.emit('joined', eventInfo);

    socket.broadcast.emit('newParticipant', userObj);

    //make users object, send it to everyone

    socket.on('addDish', function(data) {
      console.log("Server heard: AddDish", data.name, "with cost", data.cost);

      // console.log("AddDish event heard from the server!", data);
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
      // console.log("ShareDish event heard from server!", data);
      socket.broadcast.emit('dishShared', {
        user_id: data.user_id,
        dish_id: data.dish_id
      });
      util.shareDish(db, data.user_id, data.dish_id)
        .catch(function(err) {
          throw err;
        });
    });

    socket.on('unshareDish', function(data) {
      console.log("Server heard: UnshareDish with dish ID", data.dish_id, "user ID", data.user_id);
      // console.log("UnshareDish event heard from server!", data);
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
      console.log("Server heard: SendBillToGuests with tip", data.tipPercent, "and tax", data.taxPercent);
      // console.log("sendBillToGuests event heard from server!", data.taxPercent, data.tipPercent);
      socket.broadcast.emit('billsSentToGuests', data);

      util.addTipAndTax(db, data.event_id, data.taxPercent, data.tipPercent)
        .catch(function(err) {
          throw err;
        });
    });
    // }

    // socket.on('finished', function(data) { // how to
    //   util.userFinished(db, data.userId, data.eventId);
    // })
  });
};

// Required by [server.js]
module.exports = connect;

// won't need this unless using handshake sessions for user auth:
// io.use(sharedsession(session));
// socket.on("login", function(data){
//       console.log("client["+socket.handshake.session.myCustomData.userID+"] sent data: " + data);
//   })
