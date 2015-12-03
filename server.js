// # Main Server

// ## Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var handleSocket = require('./server/sockets');
var util = require('./server/utility.js');
var bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// ## Routes

// **Static folder for serving application assets**
app.use('/', express.static(__dirname + '/client'));


app.get('/*', function(req, res) {

});


// **Start the server.**
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
