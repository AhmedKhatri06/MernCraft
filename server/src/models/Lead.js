import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  projectType: { type: String, required: true },
  budget: { type: String },
  message: { type: String, required: true },
  contactPreference: { type: String },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'discussion', 'proposal', 'won', 'lost'],
    default: 'new' 
  },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
