// In this file, we will seed the User model with some randomly generated usernames
// For now, we will not specify thoughts and friends in our seeding
// Before we try writing any methods, we need to check that our database seeds correctly...
import connection from '../config/connection.js';
import { Thought, User } from '../models/index.js';
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
    const usersArray = [];
    for (let i = 0; i < 20; i++) {
        const username = getRandomName();
        const email = getRandomEmail();
        usersArray.push({
            username: username,
            email: email
        });
    }
    await User.insertMany(usersArray);
    // Function for generating thought text content.
    const genThought = () => {
        let thoughtString = '';
        const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        for (let i = 0; i < 5; i++) {
            thoughtString += chars[Math.floor(Math.random() * chars.length)];
        }
        return { thoughtText: thoughtString };
    };
    const thoughtsArray = [];
    for (let i = 0; i < 100; i++) {
        thoughtsArray.push(genThought());
    }
    await Thought.insertMany(thoughtsArray);
    // For each thought, assign the thought to a random user
    const thoughts = await Thought.find();
    for (const thought of thoughts) {
        // Get the count of all users
        const count = await User.countDocuments();
        // Get a random entry
        const random = Math.floor(Math.random() * count);
        // Again query all users but only fetch one offset by our random #
        const user = await User.findOne().skip(random).limit(-1);
        if (!user) {
            console.warn("No user found at random index:", random);
            continue;
        }
        // Add the thought to the user's list of thoughts
        user.thoughts.push(thought._id);
        // Designate the user as the thought's author
        thought.username = user._id;
        await user?.save();
        await thought.save();
    }
    ;
    const userCount = await User.countDocuments();
    for (let i = 0; i < userCount - 1; i++) {
        for (let j = i + 1; j < userCount; j++) {
            // Determine if user i and user j should be friends...
            if (Math.random() < 0.25) {
                const userI = await User.findOne().skip(i).limit(-1);
                const userJ = await User.findOne().skip(j).limit(-1);
                if (!userI || !userJ) {
                    console.warn("Invalid user combo.");
                    continue;
                }
                userI?.friends.push(userJ._id);
                userJ?.friends.push(userI._id);
                await userI.save();
                await userJ.save();
            }
        }
    }
    console.log(usersArray);
    process.exit(0);
});
