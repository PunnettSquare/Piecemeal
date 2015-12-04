var dbInfo = require('../dbInfo');
var knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: dbInfo.username,
    password: dbInfo.password,
    database: "piecemeal"
  }
});

module.exports = knex;
