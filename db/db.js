var config = require('../knexfile')
var knex = require("knex")(config['development']);

module.exports = knex;

knex.migrate.latest([config]); 
