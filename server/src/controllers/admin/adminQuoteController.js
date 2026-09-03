import Quote from '../../models/Quote.js';

// @desc    Get all quotes
// @route   GET /api/admin/quotes
// @access  Private/Admin
export const getQuotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    const total = await Quote.countDocuments();
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: quotes,
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

// @desc    Create new quote
// @route   POST /api/admin/quotes
// @access  Private/Admin
export const createQuote = async (req, res, next) => {
  try {
    const {
      leadId,
      clientName,
      clientEmail,
      title,
      projectType,
      amount,
      total,
      subtotal,
      discount,
      details,
      items,
      notes,
      status
    } = req.body;

    const finalTotal = total !== undefined ? total : (amount !== undefined ? amount : 0);

    const quote = await Quote.create({
      leadId,
      clientName,
      clientEmail,
      title,
      projectType,
      amount: finalTotal,
      total: finalTotal,
      subtotal: subtotal || finalTotal,
      discount: discount || 0,
      details,
      items: Array.isArray(items) ? items : [],
      notes,
      status: status || 'draft'
    });

    res.status(201).json({ success: true, data: quote, message: 'Quote created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quote
// @route   GET /api/admin/quotes/:id
// @access  Private/Admin
export const getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quote
// @route   PATCH /api/admin/quotes/:id
// @access  Private/Admin
export const updateQuote = async (req, res, next) => {
  try {
    const allowedFields = [
      'clientName', 'clientEmail', 'title', 'projectType',
      'amount', 'total', 'subtotal', 'discount',
      'details', 'items', 'notes', 'status', 'leadId'
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
    if (updateData.total !== undefined && updateData.amount === undefined) {
      updateData.amount = updateData.total;
    }

    const quote = await Quote.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.status(200).json({ success: true, data: quote, message: 'Quote updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quote
// @route   DELETE /api/admin/quotes/:id
// @access  Private/Admin
export const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    
    await quote.deleteOne();
    res.status(200).json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    next(error);
  }
};
