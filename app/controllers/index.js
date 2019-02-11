/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const Joi = require('joi');

const { log } = require('../logger');
const { encrypt, decrypt } = require('../helpers/encryption');
const {
  client, setAsync, getAsync, keysAsync
} = require('../helpers/redis-promise');

const postSearch = async (req, res) => {
  const { body } = req;
  const { id, decryption_key } = body;

  // get the matching keys
  const keys = await keysAsync(id);

  // reconstruct a doc with key-values
  const matchingDocs = await Promise.all(
    keys.map(async (key) => {
      const value = await getAsync(key);
      return { key, value };
    })
  );
  const results = matchingDocs.reduce((acc, doc) => {
    try {
      const decryptedValue = JSON.parse(decrypt(doc.value, decryption_key));
      acc.push({ id: doc.key, value: decryptedValue });
    } catch (err) {
      log.info(`attempted decryption of ${doc.key} with key:${decryption_key}`);
      log.error(err);
    }
    return acc;
  }, []);

  res.send(results);
};

const postAdd = async (req, res) => {
  const { body } = req;
  const { id, value, encryption_key } = body;

  try {
    const encryptedValue = encrypt(JSON.stringify(value), encryption_key);
    await setAsync(id, encryptedValue);
    return res.send(`Saved:${id}`);
  } catch (err) {
    log.error(err);
    return res.status(500).send({ statusText: err.message || 'Unable to save the payload' });
  }
};

const handlers = {
  postSearch,
  postAdd
};

const validators = {
  postSearch: {
    body: {
      id: Joi.string().required(),
      decryption_key: Joi.string().required()
    }
  },
  postAdd: {
    body: {
      id: Joi.string().required(),
      encryption_key: Joi.string().required(),
      value: [
        Joi.string()
          .allow(null)
          .required(),
        Joi.array().required(),
        Joi.number().required(),
        Joi.boolean().required()
      ]
    }
  }
};

module.exports = {
  handlers,
  validators
};
