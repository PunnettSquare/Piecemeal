// # Socket Connection Handler

var connect = function(eventUrl, eventInfo, io) {
  // Set the Socket.io namespace to the eventUrl.
  var mealEvent = io.of(eventUrl);
  mealEvent.once('connection', function(socket) {

    // socket.on('userAdded', function(user) {
    //   socket.broadcast.emit('userAdded', user);
    // });
    console.log('socket connection made with server');

    socket.emit('join', eventInfo);

    socket.on('addDish', function(data) {
      console.log("AddDish event heard from the client!");
      
      console.log('data =', data);
      //TODO add dish to DB
      socket.broadcast.emit('dishAdded', { //or mealEvent.emit to send to all
        cost: data.cost,
        name: data.name
      });
    });

  });
};

// Required by [server.js]
module.exports = connect;

// won't need this unless using handshake sessions for user auth:
// io.use(sharedsession(session));
// socket.on("login", function(data){
//       console.log("client["+socket.handshake.session.myCustomData.userID+"] sent data: " + data);
//   })
