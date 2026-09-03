import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 255 },
  phone: { type: String, maxlength: 50 },
  company: { type: String, maxlength: 150 },
  projectType: { type: String, required: true, maxlength: 100 },
  budget: { type: String, maxlength: 100 },
  message: { type: String, required: true, maxlength: 5000 },
  contactPreference: { type: String, maxlength: 50 },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'discussion', 'proposal', 'won', 'lost'],
    default: 'new' 
  },
  notes: { type: String, maxlength: 5000 }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
