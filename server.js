// # Main Server

// ## Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db/db');
var port = process.env.PORT || 8080;
var handleSocket = require('./server/sockets');
var util = require('./server/utility.js');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// ## Routes

// **Static folder for serving application assets**
app.use('/', express.static(__dirname + '/client'));



// **Wildcard route & event id handler.**
app.get('/*', function(req, res) {
  var id = req.url.slice(1);

  //TODO query DB for event
    //If not found or error, redirect to home page
    //otherwise handle the socket connection
    //send them to event
    handleSocket(req.url, io);
    res.sendFile(__dirname + '/client/loading.html');
});


// **Start the server.**
http.listen(port, function() { // why not server.listen?
  console.log('server listening on', port, 'at', new Date());
});
