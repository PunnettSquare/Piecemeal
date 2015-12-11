var generateData = require('../../generateData');
var db = require('../../db/db');
var handleSocket = require('../sockets');
var util = require('../utility.js');
var _ = require('underscore');

module.exports = function(app, io) {

  app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
  });

  app.post('/createEvent', function(req, res) {
    var username = req.body.username || 'Jerry';
    // Generate code
    var code = util.generateCode();
    util.createEvent(db, code, username)
      .then(function(dataObj) {
        res.send({
          code: code,
          user_id: dataObj.user_id[0],
          event_id: dataObj.event_id[0]
        });
      })
      .catch(function(err) {
        throw err;
      });
  });

  app.post('/newUser', function(req, res) {
    var username = req.body.username || 'Jerry';
    var code = req.body.code || 'testRoom';
    var host = req.body.host || false;
    var event_id;

    // find event ID
    util.findEvent(db, code)
      .then(function(eventIdArray) {
        event_id = eventIdArray[0].id;
        return util.createUser(db, username, event_id, false);
      })
      .then(function(guestId) {
        res.send(200, {
          user_id: guestId[0],
          event_id: event_id
        });
      })
      .catch(function(err) {
        res.send(500, err);
      });
  });

  var connections = {};

  // **Wildcard route & event id handler.**
  app.post('/*', function(req, res) {
    var code = req.url.slice(1);
    var user_id = req.body.user_id;
    res.send(200);
    if (!connections[user_id]) {
      connections[user_id] = true;
      setTimeout(function() {
        connections[user_id] = false;
      }, 5000);
      // query database for event id based on code

      util.findEvent(db, code)
        .then(function(event_id) {
          //check for an event
          if (event_id.length !== 0) {
          // retrieve the state of the event to send to socket
            return util.gatherState(db, event_id[0].id, code) // real data
              .then(function(eventInfo) {
                // handle the socket connection
                var newUserObj = _.reduce(eventInfo.users, function(user, curr) {
                  if (!!user) {
                    return user;
                  }
                  if (curr.id.toString() === req.body.user_id.toString()) {
                    return curr;
                  }
                  return user;
                }, false);
                handleSocket(req.url, eventInfo, io, newUserObj);
              });
          }
        })
        .catch(function(err) {
          throw err;
        });
    } 
  });

  // uncomment this to populate an empty database with dummy data from ./generateData.js
  // comment it out again after one run of this file
  // setTimeout(generateData, 1500);
};
