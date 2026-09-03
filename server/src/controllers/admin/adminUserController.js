import User from '../../models/User.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.search) {
      const sanitizedSearch = escapeRegex(req.query.search);
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page, limit, total, pages: Math.ceil(total / limit)
      }
    });
  } catch (error) { next(error); }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
    }

    const newStatus = req.body.isActive !== undefined ? req.body.isActive : (req.body.active !== undefined ? req.body.active : !user.isActive);
    user.isActive = newStatus;
    await user.save();
    
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) { next(error); }
};
