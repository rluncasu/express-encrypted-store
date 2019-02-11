const mongoose = require('mongoose');

const { Schema } = mongoose;

const FooSchema = new Schema({
  id: { type: 'String', unique: true, required: true },
  value: { type: Schema.Types.Mixed }
}, { versionKey: false });

mongoose.model('Foo', FooSchema);
