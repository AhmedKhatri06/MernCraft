import Lead from '../models/Lead.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, projectType, budget, message, contactPreference } = req.body;

    // Basic validation
    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }


    const newLead = await Lead.create({
      name, email, phone, company, projectType, budget, message, contactPreference
    });

    res.status(201).json({ success: true, data: newLead, message: 'Contact request received successfully' });
  } catch (error) {
    next(error);
  }
};
