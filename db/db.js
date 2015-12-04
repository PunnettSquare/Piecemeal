var knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "piecemeal"
  }
});

module.exports = knex;
