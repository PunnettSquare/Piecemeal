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

app.post('/createEvent', function(req, res) {
  var username = req.body.username || 'Jerry';
  //Generate code
  var code = util.codeGenerator()
  //crete event in DB
  util.createEvent(db, code, username)
  .then(function() {
    //redirect to room after event has been created
    res.redirect('/' + code);
  })
});


app.post('/newUser', function(req, res) {
  var eventId = req.body.eventId || 1; //setup for dummy data
  var username = req.body.username || 'Jerry';
  var code = req.body.code || 'testRoom';
  var host = req.body.host || false;
  util.createUser(db, username, eventId, host)
  .then(function(userIdArray) {
    res.status(200).send({username: username, userId: userIdArray[0]}); // things to send back possibly: usernme, definitely add this userid, eventname, eventid, ishost
  })
});


// **Wildcard route & event id handler.**
app.get('/*', function(req, res) {
  var code = req.url.slice(1);
  console.log('code =', code);
  //query database for event id based on code
  util.findEvent(db, code)
  .then(function(eventId) {
    return util.gatherState(db, eventId[0], code) //retrieve the state of the event to send to socket
    .then(function(eventInfo) {
      //handle the socket connection
      console.log(eventInfo);
      handleSocket(req.url, eventInfo, io);
      res.sendFile(__dirname + '/client/index.html');
    })
  })
  .catch(function(err) {
    res.redirect('/');  // is this where we want to redirect to?
    throw err;
  })

});


// **Start the server.**
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});

// uncomment this to populate an empty database with dummy data from ./generateData.js
// comment it out again after
// setTimeout(generateData, 1500);
