/* eslint-disable new-cap */
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

const encrypt = (clearText, password) => {
  let secret = Buffer.alloc(32);
  secret = Buffer.concat([Buffer.from(password)], secret.length);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  const encrypted = cipher.update(clearText);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
  const encryptedHex = `${iv.toString('hex')}:${finalBuffer.toString('hex')}`;
  return encryptedHex;
};

/**
 * @param {*} encryptedHex
 * @param {*} secret
 */
const decrypt = (encryptedHex, password) => {
  let secret = Buffer.alloc(32);
  secret = Buffer.concat([Buffer.from(password)], secret.length);
  const encryptedArray = encryptedHex.split(':');
  const iv = new Buffer.from(encryptedArray[0], 'hex');
  const encrypted = new Buffer.from(encryptedArray[1], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  const decrypted = decipher.update(encrypted);
  const clearText = Buffer.concat([decrypted, decipher.final()]).toString();
  return clearText;
};

module.exports = {
  encrypt,
  decrypt
};
