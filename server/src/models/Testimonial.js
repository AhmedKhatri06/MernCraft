import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  company: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
