import { Schema, model, Document } from 'mongoose';

export interface ICache extends Document {
  key: string;
  data: unknown;
  savedAt: Date;
}

const cacheSchema = new Schema<ICache>({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  savedAt: { type: Date, required: true },
});

export const Cache = model<ICache>('Cache', cacheSchema);
