import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      // Rely on User model pre('save') hook to perform the single bcrypt hash
      user.password = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
  } catch (error) { next(error); }
};
