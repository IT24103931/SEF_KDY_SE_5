import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Issue a short-lived token only after comparing the submitted password with its hash.
const adminLogin = async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || typeof password !== 'string' || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    const passwordMatches = admin && await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'Admin authentication is not configured.' });
    }

    const token = jwt.sign({ id: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ success: true, data: { token, admin: { email: admin.email, role: admin.role } } });
  } catch (error) {
    return next(error);
  }
};

export { adminLogin };