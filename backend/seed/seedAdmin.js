import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';

dotenv.config();

// Create or update the demo admin using credentials supplied only through .env.
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding an admin.');
  }

  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate({ email }, { email, passwordHash, role: 'Admin' }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`Admin account prepared for ${email}`);
};

seedAdmin().then(() => process.exit(0)).catch((error) => {
  console.error(`Admin seed failed: ${error.message}`);
  process.exit(1);
});