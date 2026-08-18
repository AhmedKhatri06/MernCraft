import PricingPlan from '../../models/PricingPlan.js';

export const getPricingPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: plans });
  } catch (error) { next(error); }
};

export const getPricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: plan });
  } catch (error) { next(error); }
};

export const createPricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.create(req.body);
    res.status(201).json({ success: true, data: plan, message: 'Created' });
  } catch (error) { next(error); }
};

export const updatePricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: plan, message: 'Updated' });
  } catch (error) { next(error); }
};

export const deletePricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) { next(error); }
};
