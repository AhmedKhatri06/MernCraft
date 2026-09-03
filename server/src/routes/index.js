import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import publicRoutes from './publicRoutes.js';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    success: true, 
    message: 'MernCraft API is running', 
    database: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

// Contact Route
router.post('/contact', submitContact);

// Auth Routes
router.use('/auth', authRoutes);

// User Routes
router.use('/user', userRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

// Public Routes (Accessible via both /api/services and /api/public/services)
router.use('/', publicRoutes);
router.use('/public', publicRoutes);

export default router;
