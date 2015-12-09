// # Socket Connection Handler
var util = require('./utility');
var db = require('../db/db');

var connect = function(eventUrl, eventInfo, io) {
  // Set the Socket.io namespace to the eventUrl.
  var mealEvent = io.of(eventUrl);
  mealEvent.once('connection', function(socket) {

    // socket.on('userAdded', function(user) {
    //   socket.broadcast.emit('userAdded', user);
    // });
    console.log('Socket connection made with server.');

    socket.emit('joined', eventInfo);

    socket.on('addDish', function(data) {
      console.log("AddDish event heard from the client!", data);

      util.createDish(db, data.name, Number(data.cost), parseInt(data.user_id), parseInt(data.event_id))
      .catch(function(err) {
        throw err;
      });

      socket.broadcast.emit('dishAdded', {
      // mealEvent.emit('dishAdded', { // use this instead of socket.broadcast to send to all for testing purposes on your client
        cost: data.cost,
        name: data.name,
        user_id: data.user_id,
        users: data.users
      });
    });

    socket.on('shareDish', function (data) {
      console.log("User is sharing dish");
      socket.broadcast.emit('dishShared', {user_id: data.user_id, dish_id: data.dish_id});
      util.shareDish(db, data.user_id, data.dish_id)
      .catch(function(err) {
        throw err;
      });
    });

    socket.on('unshareDish', function (data) {
      console.log("User is no longer sharing dish");
      socket.broadcast.emit('dishUnshared', {user_id: data.user_id, dish_id: data.dish_id});
      util.unshareDish(db, data.user_id, data.dish_id)
      .catch(function(e) {
        throw err;
      });
    });
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
