// This file defines the user model 
// Define Mongoose
import { Schema, model } from 'mongoose';
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
;
// Next, let's create the schema
const userSchema = new Schema({
    // Add individual properties and their types
    // Setting required to true will disallow null values
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please enter a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought' // This needs to be the actual name of the model defined in Thought.ts
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user' // My guess is that we don't need to do anything special for self-referencing.
        }
    ]
}, {
    // Additional settings for the model
    toJSON: {
        virtuals: true,
    },
    id: false
});
// We still need to define virtuals for our model...
userSchema
    .virtual('friendCount')
    .get(function () {
    return this.friends.length;
});
const User = model('user', userSchema);
export default User;
