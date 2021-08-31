import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { connect } from './database';
import { ApplicationConfiguration } from './config/config';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (_, __, next) {
  next(createError(404));
});

module.exports = async (config: ApplicationConfiguration) => {
  await connect(config);
  return app;
};
