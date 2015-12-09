var generateData = require('../../generateData');
var db = require('../../db/db');
var handleSocket = require('../sockets');
var util = require('../utility.js');

module.exports = function (app, io) {

  app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
  })

  app.post('/createEvent', function(req, res) {
    var username = req.body.username || 'Jerry';
    // Generate code
    var code = util.generateCode();
    util.createEvent(db, code, username)
      .then(function() {
        res.send({
          code: code
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
        res.status(200).send({
          user_id: guestId[0],
          event_id: event_id
        });
      })
      .catch(function(err) {
        res.send(500, err);
      });
  });

  // **Wildcard route & event id handler.**
  app.get('/*', function(req, res) {
    var code = req.url.slice(1);
    // query database for event id based on code
    util.findEvent(db, code)
      .then(function(event_id) {
        // retrieve the state of the event to send to socket
        return util.gatherState(db, 1, code) // dummy data
          // return util.gatherState(db, event_id[0].id, code) // real data
          .then(function(eventInfo) {
            // handle the socket connection
            handleSocket(req.url, eventInfo, io);
            res.end();
          });
      })
      .catch(function(err) {
        throw err;
      });
  });

  // uncomment this to populate an empty database with dummy data from ./generateData.js
  // comment it out again after one run of this file
  // setTimeout(generateData, 1500);

}
