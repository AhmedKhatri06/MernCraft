import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  amount: { type: Number, required: true },
  details: { type: String },
  status: { type: String, default: 'draft' }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);
