// # Socket Connection Handler

var connect = function(eventUrl, io) {
  // Set the Socket.io namespace to the eventUrl.
  var mealEvent = io.of(eventUrl);

  mealEvent.once('connection', function(socket) {

  });
};

// Required by [server.js]
module.exports = connect;
