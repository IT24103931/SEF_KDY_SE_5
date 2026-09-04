import mongoose from 'mongoose';

// Store only a hashed password so admin credentials never remain in plain text.
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin'], default: 'Admin' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;