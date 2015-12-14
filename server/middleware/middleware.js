var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('express-cors')


module.exports = function (app, express, io) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // app.use(cors({
  //   allowedOrigins: [
  //     'api.venmo.com'
  //   ]
  // }))

  app.use(bodyParser.json());


  var oauthRouter = express.Router();

  var eventRouter = express.Router();

  app.use('/', express.static(path.join(__dirname, '../../client/')));
  
  app.use(morgan('dev'));

  app.use('/auth', oauthRouter);

  app.use('/', eventRouter);

  require('../oauth/oauthRouter')(oauthRouter);

  require('../routes/eventRouter')(eventRouter, io);

  
}

