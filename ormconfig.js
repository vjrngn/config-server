const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

module.exports = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  migrations: [__dirname, 'migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
    entitiesDir: 'src/entities'
  }
};
