// # Main Server

// ## Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var handleSocket = require('./server/sockets');
var session = require('express-session');
var util = require('./server/utility.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var sessionStore = new session.MemoryStore();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'saxaphone wombat',
  resave: false,
  saveUninitialized: true
}));

// ## Routes

// **Static folder for serving application assets**
app.use('/', express.static(__dirname + '/client'));


// ** Signin Page **
app.get('/signin', function(req, res) {
  res.sendFile(__dirname + '/public/signin.html');
});

app.post('/signin', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email: email})
  .then( function (user) {
    //email isn't in the db, so we create a new one
    if ( !user ) {
      var newUser = new User({
        email: email,
        password: password,
        boards: []
      });
      newUser.save()
        .then(function(newUser) {
          util.createSession(req, res, newUser);
        });
  //username is in the db, so we check the password and see if we can log the user in      
    } else {
      user.comparePassword(password, function (match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          console.error('That password is incorrect. Please try again, or login with a different email address.');
        }
      });
    }
  });
});

app.get('/boards', function(req, res) {
  util.checkUser(req, res, function() {
    res.sendFile(__dirname + '/public/boards.html');
  });
});

//api endpoint hit by boards.html to pull the list of boards for the logged in user
app.get('/getBoards', function(req, res) {
  User.findOne({email:req.session.user.email})
  .then(function(user) {
    res.send(user.boards);
  })
});

// **Get a new whiteboard**
app.get('/new', function(req, res) {
  // Create a new mongoose board model.
  var board = new Board.boardModel({strokes: []});
  var id = board._id.toString();
  var email = req.session.user ? req.session.user.email : null;
  board.save(function(err, board) {
    if (err) { console.error(err); }
    else {
      if(email) {
        User.findOneAndUpdate({email: email},{$push: {boards: id} },{upsert:true},function(err, user){
          if(err){ console.log(err); }
          else {
            res.redirect('/' + id);
          }
        });
      } else {
        // Redirect to the new board.
        res.redirect('/' + id);
      }
    }
  });
});

app.get('/newFromBoards', function(req, res) {
  // Create a new mongoose board model.
  var board = new Board.boardModel({strokes: []});
  var id = board._id.toString();
  var email = req.session.user.email || null;
  board.save(function(err, board) {
    if (err) { console.error(err); }
    else {
      if(email) {
        User.findOneAndUpdate({email: email},{$push: {boards: id} },{upsert:true},function(err, user){
          if(err){ console.log(err); }
          else {
            res.send(id);
          }
        });
      } else {
        // Redirect to the new board.
        res.redirect('/' + id);
      }
    }
  });
});


// **Wildcard route & board id handler.**
app.get('/*', function(req, res) {
  var id = req.url.slice(1);
  Board.boardModel.findOne({id: id}, function(err, board) {
    // If the board doesn't exist, or the route is invalid,
    // then redirect to the home page.
    if (err) {
      res.redirect('/');
    } else {
      // Invoke [request handler](../documentation/sockets.html) for a new socket connection
      // with board id as the Socket.io namespace.
      handleSocket(req.url, board, io);
      // Send back whiteboard html template.
      res.sendFile(__dirname + '/public/board.html');
    }
  });
});


// **Start the server.**
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
