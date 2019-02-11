const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient(3001);

module.exports = {
  client,
  setAsync: promisify(client.set).bind(client),
  getAsync: promisify(client.get).bind(client),
  keysAsync: promisify(client.keys).bind(client)
};
