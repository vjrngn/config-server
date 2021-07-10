const knex = require('knex');

const {
  APP_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_POOL_MIN = 1,
  DB_POOL_MAX = 3
} = process.env;

module.exports = knex({
  client: 'pg',
  debug: APP_ENV === 'dev',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME
  },
  pool: {
    min: DB_POOL_MIN,
    max: DB_POOL_MAX
  }
});
