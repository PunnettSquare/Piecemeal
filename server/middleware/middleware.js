var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');


module.exports = function (app, express, io) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(morgan('dev'));

  var oauthRouter = express.Router();

  var eventRouter = express.Router();

  app.use('/', express.static(path.join(__dirname, '../../client/')));

  app.use('/auth', oauthRouter);

  app.use('/', eventRouter);

  require('../oauth/oauthRouter')(oauthRouter);

  require('../routes/eventRouter')(eventRouter, io);

  
}

