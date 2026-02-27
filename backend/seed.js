const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const users = [
      {
        name: 'Faculty User',
        email: 'ubendiran2007@gmail.com',
        password: 'faculty123',
        role: 'faculty',
        department: 'Computer Science'
      },
      {
        name: 'HOD',
        email: 'ubendiranl2007@gmail.com',
        password: 'hod123',
        role: 'hod'
      },
      {
        name: 'Principal',
        email: 'vigneshasvj@gmail.com',
        password: 'principal123',
        role: 'principal'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created: ${userData.email} (${userData.role})`);
    }

    console.log('\n✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedUsers();
