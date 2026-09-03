import Quote from '../models/Quote.js';
import Project from '../models/Project.js';
import Lead from '../models/Lead.js';

export const getUserDashboardData = async (req, res, next) => {
  try {
    const userEmail = req.user.email;

    // Find quotes matching user email
    const quotes = await Quote.find({ clientEmail: userEmail }).sort({ createdAt: -1 });

    // Find leads submitted with this email
    const leads = await Lead.find({ email: userEmail }).sort({ createdAt: -1 });

    // Featured / latest projects available
    const projects = await Project.find().sort({ createdAt: -1 }).limit(6);

    res.status(200).json({
      success: true,
      data: {
        quotes,
        leads,
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    next(error);
  }
};

export const getUserProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};
