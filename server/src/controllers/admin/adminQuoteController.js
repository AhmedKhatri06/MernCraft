import Quote from '../../models/Quote.js';

// @desc    Get all quotes
// @route   GET /api/admin/quotes
// @access  Private/Admin
export const getQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new quote
// @route   POST /api/admin/quotes
// @access  Private/Admin
export const createQuote = async (req, res, next) => {
  try {
    const quote = await Quote.create(req.body);
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
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
