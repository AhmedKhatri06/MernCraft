import User from '../../models/User.js';
import Lead from '../../models/Lead.js';
import Project from '../../models/Project.js';
import Service from '../../models/Service.js';
import PricingPlan from '../../models/PricingPlan.js';
import Quote from '../../models/Quote.js';
import Testimonial from '../../models/Testimonial.js';
import BlogPost from '../../models/BlogPost.js';

// @desc    Get dashboard overview stats
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      users,
      leads,
      newLeads,
      projects,
      services,
      pricingPlans,
      pendingQuotes,
      testimonials,
      blogPosts
    ] = await Promise.all([
      User.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Project.countDocuments(),
      Service.countDocuments({ active: true }),
      PricingPlan.countDocuments(),
      Quote.countDocuments({ status: 'draft' }), // assuming draft or sent is pending
      Testimonial.countDocuments({ published: true }),
      BlogPost.countDocuments({ status: 'published' })
    ]);

    // Fetch recent items
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);
    const recentQuotes = await Quote.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          users,
          leads,
          newLeads,
          projects,
          services,
          pricingPlans,
          pendingQuotes,
          testimonials,
          blogPosts
        },
        recent: {
          leads: recentLeads,
          projects: recentProjects,
          quotes: recentQuotes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
