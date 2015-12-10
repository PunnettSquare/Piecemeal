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
    console.log('Socket connection made with server.');

    socket.emit('joined', eventInfo);

    socket.broadcast.emit('newParticipant', userObj);

    //make users object, send it to everyone

    socket.on('addDish', function(data) {
      console.log("AddDish event heard from the client!", data);
      util.createDish(db, data.name, Number(data.cost), data.user_id, data.event_id)
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

    socket.on('shareDish', function (data) {
      console.log("User is sharing dish");
      console.log('data.dish_id =', data.dish_id);
      console.log('data.user_id =', data.user_id);

      socket.broadcast.emit('dishShared', {user_id: parseInt(data.user_id), dish_id: parseInt(data.dish_id)});
      util.shareDish(db, parseInt(data.user_id), parseInt(data.dish_id))
      .catch(function(err) {
        throw err;
      });
    });

    socket.on('unshareDish', function (data) {
      console.log("User is no longer sharing dish");
      socket.broadcast.emit('dishUnshared', {user_id: parseInt(data.user_id), dish_id: parseInt(data.dish_id)});
      util.unshareDish(db, parseInt(data.user_id), parseInt(data.dish_id))
      .catch(function(err) {
        throw err;
      });
    });

    socket.on('sendBillToGuests', function(data) {
      console.log('Bill data sent to guests =', data);
      socket.broadcast.emit('billsSentToGuests', data);
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
