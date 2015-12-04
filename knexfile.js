var dbInfo = require('./dbInfo');

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: "localhost",
      user: dbInfo.username,
      password: dbInfo.password,
      database: "piecemeal"
    }
  }
}
