import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  clientName: { type: String, maxlength: 100 },
  clientEmail: { type: String, maxlength: 255 },
  title: { type: String, maxlength: 200 },
  projectType: { type: String, maxlength: 100 },
  amount: { type: Number, required: true },
  total: { type: Number },
  subtotal: { type: Number },
  discount: { type: Number, default: 0 },
  details: { type: String, maxlength: 5000 },
  items: [{
    description: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  notes: { type: String, maxlength: 5000 },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], 
    default: 'draft' 
  }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);
