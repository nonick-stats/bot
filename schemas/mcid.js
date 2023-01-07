const { Schema, SchemaTypes, model } = require('mongoose');

const mcidSchema = new Schema({
  userId: { type: SchemaTypes.String, required: true, unique: true },
  java: { type: SchemaTypes.String, default: null },
  be: { type: SchemaTypes.String, default: null },
});

module.exports = model('mcid', mcidSchema);