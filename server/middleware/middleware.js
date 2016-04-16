// # Middleware

// ##### [Back to Table of Contents](./tableofcontents.html)

// **Summary**: List of Middleware for the application.

var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');

module.exports = function(app, express, io) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  var oauthRouter = express.Router();

  var eventRouter = express.Router();

  app.use(morgan('dev'));

  // **Static folders for serving application assets**

  app.use('/assets', express.static(path.join(__dirname, '../../client/assets'), {
    maxage: 1000 * 60 * 60 * 24 * 360
  }));

  if (process.env.PORT) {
    // Production static files
    app.use('/', express.static(path.join(__dirname, '../../dist/client/')));
  } else {
    // Development static files
    app.use('/', express.static(path.join(__dirname, '../../client/')));
  }

  // **Static folder for serving documentation files**
  app.use('/docs', express.static(path.join(__dirname, '../../docs')));

  //  **Router to handle oAuth requests**
  app.use('/auth', oauthRouter);

  // **Router to handle general application requests**
  app.use('/', eventRouter);

  require('../oauth/oauthRouter')(oauthRouter);

  require('../routes/eventRouter')(eventRouter, io);

};
