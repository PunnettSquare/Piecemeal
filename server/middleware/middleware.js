var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');


module.exports = function (app, express, io) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin: http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    next();
  });

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

