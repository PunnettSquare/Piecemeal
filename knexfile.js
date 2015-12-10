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
    client: 'pg',
    connection: HEROKU_POSTGRESQL_COLOR_URL
  }
}
