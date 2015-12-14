var passport = require('passport');
var VenmoStrategy = require('passport-venmo').Strategy;
if (process.env.PORT) {
  var venmoInfo = {id:process.env.VENMO_ID, secret: process.env.VENMO_SECRET}
} else {
  var venmoInfo = require('../../venmoApiKeys');
}
var cookieParser = require('cookie-parser');
var db = require('../../db/db');
var util = require('../utility');
module.exports = function(app) {

  app.use(passport.initialize());
  app.use(cookieParser());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    done(null, id);
  });

  passport.use(new VenmoStrategy({
      clientID: venmoInfo.id,
      clientSecret: venmoInfo.secret,
      callbackURL: "http://localhost:8080/auth/venmo/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('profile', profile);
      var user = {code: profile._json.id};
      var code = util.generateCode();
      // console.log('profile._json =', profile._json);
      util.createEvent(db, profile._json.id, profile._json.username);
      console.log('coming back from venmo oauth');
      return done(null, user);
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
      failureRedirect: '/' }), function() {});

  app.get('/venmo/callback',
    passport.authenticate('venmo', { failureRedirect: '/' }),
    function(req, res) {
      console.log('req.user: ',req.user);
      res.redirect('/testRoom');
    });
}
