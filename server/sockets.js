// # Socket Connection Handler

var connect = function(eventUrl, io) {
  // Set the Socket.io namespace to the eventUrl.
  var mealEvent = io.of(eventUrl);

  mealEvent.once('connection', function(socket) {


  });
};

// Required by [server.js]
module.exports = connect;

      // won't need this unless using user auth:
      // io.use(sharedsession(session));

      // io.on('connection', function (socket) {
      //   console.log("connected to socket");

      //   // ** ---- server-side

      //   socket.emit('newappcreated', { hello: 'world' }); //what is hello: world?
        
      //   socket.on('userAdded', function(user){
      //     io.emit('userAdded', user);
      //   });

      //   socket.on('my other event', function (data) {
      //     console.log(data);
      //   });

      //   // only if using handshake sessions for user auth
      //   // socket.on("login", function(data){
      //   //       console.log("client["+socket.handshake.session.myCustomData.userID+"] sent data: " + data);
      //   //   })
      // });
