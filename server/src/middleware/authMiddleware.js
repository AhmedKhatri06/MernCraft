import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    if (!req.user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
