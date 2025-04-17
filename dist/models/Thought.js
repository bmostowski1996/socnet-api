// This file defines the Thought model. 
// Remember, the procedure here is similar to constructing the User model...
// Define Mongoose
import { Schema, model, Types } from 'mongoose';
;
// Create the reaction schema
const reactionSchema = new Schema({
    reactionId: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now }
});
// Create the thought schema
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reactions: [reactionSchema]
}, {
    // Additional settings for the model
    toJSON: {
        virtuals: true,
    },
    id: false
});
thoughtSchema.virtual('reactionCount')
    .get(function () {
    return this.reactions.length;
});
const Thought = model('thought', thoughtSchema);
export default Thought;
