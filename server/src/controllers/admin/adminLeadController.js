import Lead from '../../models/Lead.js';

// @desc    Get all leads (with pagination & search)
// @route   GET /api/admin/leads
// @access  Private/Admin
export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Search and filters
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/admin/leads/:id
// @access  Private/Admin
export const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status/notes
// @route   PATCH /api/admin/leads/:id
// @access  Private/Admin
export const updateLead = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    
    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    
    await lead.save();
    res.status(200).json({ success: true, data: lead, message: 'Lead updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/admin/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
