import Lead from '../models/Lead.js';
import sendEmail from '../utils/sendEmail.js';

const sanitizeInput = (str) => (typeof str === 'string' ? str.replace(/<[^>]*>?/gm, '').trim() : str);

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, projectType, budget, message, contactPreference } = req.body;

    // Basic validation
    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = typeof email === 'string' ? email.trim() : email;
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedCompany = sanitizeInput(company);
    const sanitizedProjectType = sanitizeInput(projectType);
    const sanitizedBudget = sanitizeInput(budget);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedPreference = sanitizeInput(contactPreference);

    const newLead = await Lead.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      company: sanitizedCompany,
      projectType: sanitizedProjectType,
      budget: sanitizedBudget,
      message: sanitizedMessage,
      contactPreference: sanitizedPreference
    });

    // Notify admin via email (non-blocking)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.FROM_EMAIL || 'khatriahmed405@gmail.com';
    try {
      await sendEmail({
        email: adminEmail,
        subject: `[MernCraft Lead] New Inquiry from ${sanitizedName} (${sanitizedProjectType})`,
        message: `New client inquiry received:\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nPhone: ${sanitizedPhone || 'N/A'}\nCompany: ${sanitizedCompany || 'N/A'}\nProject Type: ${sanitizedProjectType}\nBudget: ${sanitizedBudget || 'N/A'}\nPreference: ${sanitizedPreference || 'email'}\n\nMessage:\n${sanitizedMessage}`,
        html: `
          <h3>New Lead Received</h3>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
          <p><strong>Phone:</strong> ${sanitizedPhone || 'N/A'}</p>
          <p><strong>Company:</strong> ${sanitizedCompany || 'N/A'}</p>
          <p><strong>Project Type:</strong> ${sanitizedProjectType}</p>
          <p><strong>Budget:</strong> ${sanitizedBudget || 'N/A'}</p>
          <p><strong>Preference:</strong> ${sanitizedPreference || 'email'}</p>
          <div style="margin-top: 15px; padding: 12px; background: #f3f4f6; border-radius: 6px;">
            <strong>Message:</strong>
            <p>${sanitizedMessage}</p>
          </div>
        `
      });
      console.log(`Notification email dispatched to ${adminEmail} for lead ${newLead._id}`);
    } catch (emailErr) {
      console.error(`Admin notification email could not be sent for lead ${newLead._id}:`, emailErr.message);
    }

    res.status(201).json({ success: true, data: newLead, message: 'Contact request received successfully' });
  } catch (error) {
    next(error);
  }
};
