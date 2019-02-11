const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const log = bunyan.createLogger({
  name: 'FOO',
  streams: [
    {
      type: 'raw',
      stream: prettyStdOut
    }
  ]
});

module.exports = {
  log
};
