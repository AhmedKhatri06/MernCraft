import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin User';

    if (!email || !password) {
      console.error('Usage: node src/scripts/createAdmin.js <email> <password> [name]');
      process.exit(1);
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.error('User with this email already exists');
      process.exit(1);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // The User schema pre-save hook will hash this automatically
      role: 'admin',
    });

    console.log(`Admin user created successfully! Email: ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
