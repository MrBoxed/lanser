const mongoose = require('mongoose');
const User = require('./models/User'); // assuming the schema is saved in 'models/User.js'

async function createUser() {
  try {
    const user = new User({
      username: 'john_doe',
      password_hash: 'hashed_password_value', // You'll want to hash this properly
      salt: 'random_salt_value',
      email: 'john.doe@example.com',
      full_name: 'John Doe',
      date_of_birth: '1990-01-01',
      location: 'New York, USA',
      role: 'user',
      subscription_plan: 'premium',
      language_preference: 'en',
      address: {
        address_line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA'
      },
      notifications: {
        email_notifications: true,
        sms_notifications: false,
        app_push_notifications: true
      }
    });

    await user.save();
    console.log('User created successfully:', user);
  } catch (err) {
    console.error('Error creating user:', err);
  }
}

createUser();
