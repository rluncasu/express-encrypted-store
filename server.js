/* eslint-disable global-require */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const ev = require('express-validation');
const bodyParser = require('body-parser');

const { log } = require('./app/logger');

// register models
require('./app/models/index');

const { validators, handlers } = require('./app/controllers');


const PORT = 3000;
const app = express();

const mongoServer = new MongoMemoryServer();

// set global options for the validator
ev.options({
  status: 422,
  statusText: 'Unprocessable Entity',
  allowUnknownBody: false
});

mongoose.Promise = Promise;
mongoServer
  .getConnectionString()
  .then((mongoUri) => {
    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      useNewUrlParser: true,
      useCreateIndex: true
    };

    mongoose.connection.on('error', (e) => {
      if (e.message.code === 'ETIMEDOUT') {
        log.error(e);
        mongoose.connect(mongoUri, mongooseOpts);
      }
      log.error(e);
    });

    mongoose.connection.once('open', () => {
      log.info(`MongoDB successfully connected to ${mongoUri}`);
    });

    return mongoose.connect(mongoUri, mongooseOpts);
  })
  .then(() => {
    app.use(bodyParser.json());

    // setting up express routes
    app.post('/search', ev(validators.postSearch), handlers.postSearch);
    app.post('/add', ev(validators.postAdd), handlers.postAdd);

    // error handler
    app.use((err, req, res, next) => {
      log.error(err);
      // specific for validation errors
      if (err instanceof ev.ValidationError) {
        return res.status(err.status).json(err);
      }

      // other type of errors, it *might* also be a Runtime Error
      // example handling
      if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(err.stack);
      }
      return res.status(500);
    });

    // booting express
    app.listen(PORT, () => log.info(`App listening on port ${PORT}!`));
  });
