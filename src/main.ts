import express from 'express';
import createError from 'http-errors';
import path from 'path';
import { ApplicationConfiguration } from './config/config';
import { connect } from './database';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = async (config: ApplicationConfiguration) => {
  await connect(config);

  // catch 404 and forward to error handler
  app.use(function (_, __, next) {
    next(createError(404));
  });

  return app;
};
