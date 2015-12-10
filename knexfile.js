module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: "localhost",
      user: 'admin',
      password: 'admin',
      database: "piecemeal"
    }
  },

  prod: {
    client: 'postgresql',
    connection: HEROKU_POSTGRESQL_COLOR_URL
  }
}
