import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema({
  tier: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('PricingPlan', pricingPlanSchema);
