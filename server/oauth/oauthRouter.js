var passport = require('passport');
var VenmoStrategy = require('passport-venmo').Strategy;
var session = require('express-session');
if (process.env.PORT) {
  var venmoInfo = {id:process.env.VENMO_ID, secret: process.env.VENMO_SECRET}
} else {
  var venmoInfo = require('../../venmoApiKeys');
}
var cookieParser = require('cookie-parser');
var db = require('../../db/db');
var util = require('../utility');
module.exports = function(app) {

  app.use(cookieParser());  
  app.use(session({secret:'green tree'}))
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  //   if ('OPTIONS' == req.method) {
  //     res.send(200);
  //   }
  //   next();
  // });

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db('users').where({
          id: id })
    .then(function(user) {
      done(null, user);
    })
  });

  passport.use(new VenmoStrategy({
      clientID: venmoInfo.id,
      clientSecret: venmoInfo.secret,
      callbackURL: "http://127.0.0.1:8080/auth/venmo/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('profile', profile);
      var venmoUsername = profile.username;;
      // console.log('profile._json =', profile._json);
      // util.createEvent(db, profile.username, profile.displayName)
      util.findUser(db, venmoUsername)
      .then(function(result) {
        console.log('result =', result);
        console.log('coming back from venmo oauth');
        if (result.length === 0) {
          db('users').insert({
            venmoUsername: venmoUsername,
            username: profile.displayName,
            phone: profile.phone,
            email: profile.email
          })
          .then(function() {
            return util.findUser(db, venmoUsername)
          })
          .then(function(rows) {
            return done(null, rows[0])
          })
        } else {
          return done(null, result[0]);
        }
      })

    }
  ));

  app.get('/venmo', passport.authenticate('venmo', {
      scope: [
      'make_payments',
      'access_feed', 
      'access_profile', 
      'access_email', 
      'access_phone', 
      'access_balance', 
      'access_friends'], 
      failureRedirect: '/' }));

  app.get('/venmo/callback',
    passport.authenticate('venmo', { failureRedirect: '/' }),
    function(req, res) {
      console.log('req.user: ',req.user);
      console.log('req.session =', req.session);
      res.redirect('/#/dashboard');
    });

  app.get('/createEvent', function(req, res) {
    console.log('req.user: ' , req.user);
    console.log(req.session)
    console.log('req.isAuthenticated() =', req.isAuthenticated());
    var user_id = req.user[0].id;
    var username = req.user[0].username;
    if (req.isAuthenticated()) {
      var code = util.generateCode()
      util.createEventVenmo(db, code, user_id)
      .then(function(event_id) {
        var responseObject = {
          event_id: event_id[0],
          code:code,
          user_id: user_id,
          username: username
          // venmoUsername: req.user[0].venmoUsername
        }
        console.log('responseObject =', responseObject);
        res.send(responseObject);
      })
    } else {
      res.end();
    }
  })
}
