// # Socket Connection Handler

var connect = function(eventUrl, io) {
  // Set the Socket.io namespace to the eventUrl.
  var mealEvent = io.of(eventUrl);

  mealEvent.once('connection', function(socket) {

  //   socket.on('userAdded', function(user){
  //     io.emit('userAdded', user);
  //   });

  });
};

// Required by [server.js]
module.exports = connect;

  // won't need this unless using handshake sessions for user auth:
    // io.use(sharedsession(session));
    // socket.on("login", function(data){
    //       console.log("client["+socket.handshake.session.myCustomData.userID+"] sent data: " + data);
    //   })
