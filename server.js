// # Main Server

// ## Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
<<<<<<< HEAD
var db = require('./db/db');
=======
var path = require('path');
>>>>>>> (feat) Add username post request, client-side small changes
var port = process.env.PORT || 8080;
// var handleSocket = require('./server/sockets');
var util = require('./server/utility.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));



// ## Routes

// **Static folder for serving application assets**
app.use('/', express.static(path.join(__dirname, '/client')));

app.get('/createEvent', function(req, res) {
  //TODO crete event in DB
  //Generate URL
  var url = 'testRoom';
  //redirect to room after event has been created
  res.redirect('/' + url);
});


app.post('/newUser', function(req, res) {
  //create user in DB
  var userObject = {username: req.body, id: 1};
  //send back id
  res.status(200).send(userObject);
});

// **Wildcard route & event id handler.**
app.get('/*', function(req, res) {
  var id = req.url.slice(1);
  //dummy data for mvp
  var eventInfo = {users: [
    {
      id: 3,
      username:'Jackson',
      dishes: {1: {cost: 10, name: 'Chicken Salad'}}
    },
    {
      id: 2,
      username: 'Michelle',
      dishes: {2: {cost: 12, name: 'Hamburger'}}
    }
    ]};
  //TODO query DB for event
    //If not found or error, redirect to home page
    //otherwise handle the socket connection
    //send them to event

    handleSocket(req.url, eventInfo, io);
    // res.sendFile(__dirname + '/client/app/loading/loading.html')
});


// **Start the server.**
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
