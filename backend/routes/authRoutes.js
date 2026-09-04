import express from 'express';
import rateLimit from 'express-rate-limit';
import { adminLogin } from '../controllers/authController.js';

// Limit repeated login attempts while keeping normal development use convenient.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

const router = express.Router();

router.post('/admin-login', loginLimiter, adminLogin);

export default router;