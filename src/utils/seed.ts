// In this file, we will seed the User model with some randomly generated usernames
// For now, we will not specify thoughts and friends in our seeding

// Before we try writing any methods, we need to check that our database seeds correctly...

import connection from '../config/connection.js';
import { User } from '../models/index.js';
import { getRandomName, getRandomEmail } from './data.js';

console.log(getRandomName());
connection.on('error', (err) => err);

connection.once('open', async () => {

  // Delete the collections if they exist
  let thoughtCheck = await connection.db?.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck?.length) {
    await connection.dropCollection('thoughts');
  }

  let userCheck = await connection.db?.listCollections({ name: 'users' }).toArray();
  if (userCheck?.length) {
    await connection.dropCollection('users');
  }

  const users = [];

  for (let i = 0; i < 20; i++) {
    const username = getRandomName();
    const email = getRandomEmail();

    users.push({
      username: username,
      email: email
    });
  }

  await User.insertMany(users);

  // Since I just need to test this functionality works, I will generate 20 random strings and assign them randomly to the generated users
  
  const thought;

  console.log(users);
  process.exit(0);
});