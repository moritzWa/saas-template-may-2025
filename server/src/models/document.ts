import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Untitled' },
  content: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp on save
documentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export type IDocument = InferSchemaType<typeof documentSchema>;
export type DocumentDocument = HydratedDocument<IDocument>;
export const Document = mongoose.model('Document', documentSchema);
