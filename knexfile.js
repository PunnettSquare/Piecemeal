module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: "127.0.0.1",
      user: 'admin',
      password: 'admin',
      database: "piecemeal"
    }
  },

  prod: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
