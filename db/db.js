if(process.env.DATABASE_URL) {
  environment = 'prod';
} else {
  environment = 'development';
}
var environment; 
var config = require('../knexfile')
var knex = require("knex")(config[environment]);

module.exports = knex;

knex.migrate.latest([config]); 
