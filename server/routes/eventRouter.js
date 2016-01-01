var generateData = require('../../generateData');
var db = require('../../db/db');
var handleSocket = require('../sockets');
var util = require('../utility.js');
var _ = require('underscore');

module.exports = function(app, io) {

  app.get('/:code', function(req, res) {
    res.redirect('/#/' + req.params.code.toLowerCase() + '/loading');
  });

  app.post('/eventInfo', function(req, res) {
    var code = req.body.code;

    util.findEvent(db, code)
      .then(function(event_id) {
        if (event_id.length !== 0) {
          return util.gatherState(db, event_id[0].id, code) // real data
            .then(function(eventInfo) {
              res.send(eventInfo.users);
            });
        } else {
          res.send(false);
        }
      }).catch(function(err) {
        console.log("Room doesn't exist.");
        throw err;
      });
  });

  app.post('/createEvent', function(req, res) {
    var username = req.body.username || 'Jerry';

    var code = util.generateCode();
    util.createEvent(db, code, username)
      .then(function(dataObj) {
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

  app.get('/checkCode/:code', function(req, res) {
    util.checkCode(db, req.params.code)
      .then(function(billExists) {
        res.send(billExists);
      });
  });

  app.post('/newUser', function(req, res) {
    var username = req.body.username;
    var code = req.body.code;
    var host = req.body.host || false;
    var event_id;

    // find event ID
    util.findEvent(db, code)
      .then(function(eventIdArray) {
        event_id = eventIdArray[0].id;
        return util.createUser(db, username, event_id, false);
      })
      .then(function(guestId) {
        res.status(200).send({
          user_id: guestId[0],
          event_id: event_id
        });
      })
      .catch(function(err) {
        console.log("Error!", err);
        res.status(500).send(err);
      });
  });

  var connections = {};

  // **Wildcard route & event id handler.**
  app.post('/*', function(req, res) {
    var code = req.url.slice(1);
    var user_id = req.body.user_id;

    console.log("NEW POST /* REQUEST: with ID", user_id, "and code", code);
    res.sendStatus(200);

    if (!connections[user_id]) {
      connections[user_id] = true;
      setTimeout(function() {
        connections[user_id] = false;
      }, 2000);

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
