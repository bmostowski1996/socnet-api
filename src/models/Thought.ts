// This file defines the Thought model. 
// Remember, the procedure here is similar to constructing the User model...

// Define Mongoose
import { Schema, model, Document, ObjectId, Types } from 'mongoose';

interface IReaction extends Document {
    reactionId: ObjectId,
    reactionBody: string,
    username: ObjectId, 
    createdAt: Date
}

// The notation I<item> should be understood as "interface <item>"
interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: ObjectId; // Needs to refer to User model
    reactions: IReaction[]; // I need to clarify the type later on down the line...
};

// Create the reaction schema
const reactionSchema = new Schema<IReaction>({
    reactionId: {type: Schema.Types.ObjectId, default: () => new Types.ObjectId()},
    reactionBody: {type: String, required: true, maxLength: 280},
    username: {type: Schema.Types.ObjectId, ref: 'user'},
    createdAt: {type: Date, default: Date.now}
});

// Create the thought schema
const thoughtSchema = new Schema<IThought>(
    {
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
    },
    {
        // Additional settings for the model
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

thoughtSchema.virtual('reactionCount')
    .get(function (this: IThought) {
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

export default Thought; 