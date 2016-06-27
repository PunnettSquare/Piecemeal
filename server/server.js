// # Server

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: High level overview of server setup.

var express = require('express');

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

var port = process.env.PORT || 8080;

require('./middleware/middleware')(app, express, io);

http.listen(port, function() {

  console.log('Server listening on', port, 'at', new Date());

});
