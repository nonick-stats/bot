import { Schema, SchemaTypes, model } from 'mongoose';

const MinecraftIDs = new Schema({
  userId: { type: SchemaTypes.String, required: true, unique: true },
  java: { type: SchemaTypes.String, default: null },
  be: { type: SchemaTypes.String, default: null },
});

export default model('mcid', MinecraftIDs);