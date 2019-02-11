/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const Joi = require('joi');
const mongoose = require('mongoose');
const { log } = require('../logger');
const { encrypt, decrypt } = require('../helpers/encryption');

const FooModel = mongoose.model('Foo');

const postSearch = async (req, res) => {
  const { body } = req;
  const { id, decryption_key } = body;
  const splitId = id.split('*');
  const hasWildcard = splitId.length > 1;

  let query = id;

  if (hasWildcard) {
    const [queryBase] = splitId;
    query = new RegExp(queryBase);
  }
  const matchingDocs = await FooModel.find({ id: query }).lean();
  const results = matchingDocs.reduce((acc, doc) => {
    try {
      const decryptedValue = decrypt(doc.value, decryption_key);
      acc.push({ ...doc, value: decryptedValue });
    } catch (err) {
      log.error(`attempted decryption of ${doc.id} with key:${decryption_key}`);
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
    const encryptedValue = encrypt(value, encryption_key);
    const payload = new FooModel({ ...body, value: encryptedValue });
    await payload.save();
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
      value: Joi.required()
    }
  }
};

module.exports = {
  handlers,
  validators
};
