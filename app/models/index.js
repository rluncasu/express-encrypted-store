const mongoose = require('mongoose');
const { log } = require('../logger');

const { Schema } = mongoose;

const FooSchema = new Schema({
  id: { type: 'String', index: true },
  value: { type: Schema.Types.Mixed }
});

mongoose.model('Foo', FooSchema);
