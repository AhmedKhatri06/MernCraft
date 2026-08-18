import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  startingPrice: { type: String }, // Storing as String to accommodate text ranges like '₹15,000–₹30,000'
  icon: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
