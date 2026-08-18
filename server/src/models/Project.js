import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  technologies: [{ type: String }],
  link: { type: String }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
