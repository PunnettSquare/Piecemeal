// # Middleware

// ##### [Back to Table of Contents](./tableofcontents.html)

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
  // **Static folder for serving application assets**
  app.use('/', express.static(path.join(__dirname, '../../client/')));
  // **Static folder for serving documentation files**
  app.use('/docs', express.static(__dirname + '../../docs'));

  //  **Router to handle oAuth requests**
  app.use('/auth', oauthRouter);

  // **Router to handle general application requests**
  app.use('/', eventRouter);

  require('../oauth/oauthRouter')(oauthRouter);

  require('../routes/eventRouter')(eventRouter, io);

};
