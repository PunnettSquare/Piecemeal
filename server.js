// # Main Server

// ## Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db/db');
var path = require('path');
var port = process.env.PORT || 8080;
var handleSocket = require('./server/sockets');
var util = require('./server/utility.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var generateData = require('./generateData')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));



// ## Routes


// **Static folder for serving application assets**
app.use('/', express.static(path.join(__dirname, 'client/')));

app.get('/createEvent', function(req, res) {
  //TODO crete event in DB
  //Generate URL
  var url = 'testRoom';
  //redirect to room after event has been created
  res.redirect('/' + url);
});


app.post('/newUser', function(req, res) {
  //create user in DB
  var userObject = {
    username: req.body.username,
    id: 1,
    isHost: req.body.isHost
  };
  //send back id
  res.status(200).send(userObject);
});


// **Wildcard route & event id handler.**
app.get('/*', function(req, res) {
  var id = req.url.slice(1);
  //query database for event id based on url
  //call utils to make event info
  //dummy data for mvp
  var eventInfo = {
    users: [{
      id: 3,
      username: 'Jackson',
      dishes: {
        1: {
          cost: 10,
          name: 'Chicken Salad'
        }
      }
    }, {
      id: 2,
      username: 'Michelle',
      dishes: {
        2: {
          cost: 12,
          name: 'Hamburger'
        }
      }
    }]
  };
  //TODO query DB for event
  //If not found or error, redirect to home page
  //otherwise handle the socket connection
  //send them to event

  handleSocket(req.url, eventInfo, io);
  res.sendFile(__dirname + '/client/index.html');
});


// **Start the server.**
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});

// uncomment this to populate an empty database with dummy data from ./generateData.js
// comment it out again after
// setTimeout(generateData, 1500);
