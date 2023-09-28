import { Schema, model } from 'mongoose';

const MinecraftIDs = new Schema({
  userId: { type: Schema.Types.String, required: true, unique: true },
  je: { type: Schema.Types.String, default: null },
  be: { type: Schema.Types.String, default: null },
});

export default model('mcid', MinecraftIDs);