// # Event Router

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: Express router which handles requests generally related to events/bills.

var generateData = require('../../test/generateData.js');
var db = require('../../db/db');
var handleSocket = require('../sockets');
var util = require('../utility.js');
var _ = require('underscore');
module.exports = function(app, io) {

  // On server start, wait for database to be set up then check if application settings are stored in database.  If no settings found, set the defaults.
  setTimeout(function() {
    util.setFirstWord(db);
  }, 5000);
  // **Direct route to join a specific room**
  app.get('/:code', function(req, res) {
    // Redirect client to name entry screen
    res.redirect('/#/' + req.params.code.toLowerCase() + '/loading');
  });

  // **Get users associated with a specific event code**
  app.post('/eventInfo', function(req, res) {
    var code = req.body.code;
    // Find event associated with event code
    util.findEvent(db, code)
      .then(function(event_id) {
        if (event_id.length !== 0) {
          // Query for users associated with that event's ```event_id```
          return util.gatherState(db, event_id[0].id, code) // real data
            .then(function(eventInfo) {
              // Send list of users to client, used currently for room attendence on loading page
              res.send(eventInfo.users);
            });
        } else {
          res.send(false);
        }
      }).catch(function(err) {
        res.send(500);
        console.log("Room doesn't exist.");
        throw err;
      });
  });

  // **Create an event**
  app.post('/createEvent', function(req, res) {
    var username = req.body.username;
    // Create a unique event code
    util.generateCode(db)
      .then(function(code) {
        // Create the event
        util.createEvent(db, code, username)
          .then(function(dataObj) {
            // Send relevant information to client to be stored in window.localStorage
            res.status(200).send({
              code: code,
              user_id: dataObj.user_id[0],
              event_id: dataObj.event_id[0]
            });
          })
          .catch(function(err) {
            throw err;
          });
      });
  });

  // **Check if a event code exists in the database**
  app.get('/checkCode/:code', function(req, res) {
    util.checkCode(db, req.params.code)
      .then(function(billExists) {
        res.send(billExists);
      })
      .catch(function(err) {
        throw err;
      });
  });

  // **Make a new user**
  app.post('/newUser', function(req, res) {
    var username = req.body.username;
    var code = req.body.code;
    var host = req.body.host || false;
    var event_id;

    // Find event ID associated with event code
    util.findEvent(db, code)
      .then(function(eventIdArray) {
        event_id = eventIdArray[0].id;
        // Write new user to database
        return util.createUser(db, username, event_id, false);
      })
      .then(function(user_id) {
        // Send relevant information to client to be stored in window.localStorage
        res.status(200).send({
          user_id: user_id[0],
          event_id: event_id
        });
      })
      .catch(function(err) {
        console.log("Error!", err);
        res.status(500).send(err);
      });
  });

  app.put('/addVenmoUser', function(req, res) {
    var event_id = req.body.event_id;
    var user_id = req.body.user_id;

    util.addVenmoUser(db, event_id, user_id)
    .then(function() {
      res.send(200);
    })
    .catch(function (err) {
      console.log("Error!", err);
      res.status(500).send(err);
    })
  })

  var connections = {};

  // **Wildcard route for connecting users to their respective socket.io namespace**
  app.post('/*', function(req, res) {
    var code = req.url.slice(1);
    var user_id = req.body.user_id;

    console.log("NEW POST /* REQUEST: with ID", user_id, "and code", code);
    res.sendStatus(200);
    // Check for duplicate requests to avoid duplicate sets of socket event listeners for a given user
    if (!connections[user_id]) {
      connections[user_id] = true;
      // Remove check after a short period to allow refreshing of page
      setTimeout(function() {
        connections[user_id] = false;
      }, 2000);

      // Query database for event id based on code
      util.findEvent(db, code)
        .then(function(event_id) {
          //check for an event
          if (event_id.length !== 0) {
            // Retrieve the state of the event to send to socket
            return util.gatherState(db, event_id[0].id, code)
              .then(function(eventInfo) {
                // Extract new user data object to send to other existing clients
                var newUserObj = _.reduce(eventInfo.users, function(user, curr) {
                  if (!!user) {
                    return user;
                  }
                  if (curr.id.toString() === req.body.user_id.toString()) {
                    return curr;
                  }
                  return user;
                }, false);
                // Handle the socket connection
                handleSocket(req.url, eventInfo, io, newUserObj);
              });
          }
        })
        .catch(function(err) {
          throw err;
        });
    }
  });

};
