/* eslint-disable global-require */
const express = require('express');
const ev = require('express-validation');
const bodyParser = require('body-parser');

const { log } = require('./app/logger');

const { validators, handlers } = require('./app/controllers');


const PORT = 3000;
const app = express();

// set global options for the validator
ev.options({
  status: 422,
  statusText: 'Unprocessable Entity',
  allowUnknownBody: false
});

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
