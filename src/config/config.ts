require('dotenv').config();

const { APP_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;

export interface ApplicationConfiguration {
  database: {
    host: string | undefined;
    port: number | undefined;
    username: string | undefined;
    password: string | undefined;
    name: string | undefined;
  };
  environment?: string;
}

export const config: ApplicationConfiguration = {
  database: {
    host: DB_HOST,
    port: parseInt(DB_PORT!),
    username: DB_USER,
    password: DB_PASSWORD,
    name: DB_NAME
  },
  environment: APP_ENV
};
