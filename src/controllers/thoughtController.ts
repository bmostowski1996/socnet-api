import User from '../models/User.js';
import Thought from '../models/Thought.js'; // We need this for deleting users...
import type { IReaction } from '../models/Thought.js';
import { Request, Response } from 'express';

export const getThoughts = async (_req: Request, res: Response ) => {
    try {
        const thoughts = await Thought.find()
        .select('-__v')
        .populate({
            path: 'username',
            select: 'username'
        })
        .populate({
            path: 'reactions.username',
            select: 'username'
        });

        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
        console.error("Error in getThoughts: ", err);
    }
};

export const getSingleThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate({
            path: 'username',
            select: 'username'
        });

        if (!thought) {
        res.status(404).json({ message: 'No thought with that ID' });
        } else {
        res.json(thought);
        };

    } catch (err) {
        console.error("Error in getSingleThought: ", err);
        res.status(500).json(err);
    }
};

export const postThought = async (req: Request, res: Response) => {
    try {
        const { thoughtText: thoughtText, username: userId } = req.body;

        console.log(`Parameters received: ${thoughtText}, ${userId}`);

        const user = await User.findById(userId);
        

        if (!user) {
            return res.status(404).json({message: 'No user with that ID'});
        }

        const thought = await Thought.insertOne({
            thoughtText: thoughtText,
            username: userId
        });

        user?.thoughts.push(thought._id);
        await user.save();
        
        return res.json(thought);
    } catch(err) {
        console.error("Error in postThought: ", err);
        return res.status(500).json(err);
    }
};

export const putThought = async(req: Request, res: Response) => {
    try {
        const thought = await Thought.updateOne(
            { _id: req.params.thoughtId },
            {$set: { thoughtText: req.body.thoughtText } }
        );
        res.json(thought);
    } catch (err) {
        console.error("Error in putThought: ", err);
        res.status(500).json(err);
    }
};

export const deleteThought = async(req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            const id = thought._id;
            await Thought.deleteOne({_id: id});
            await User.updateOne(
                { _id: thought.username },
                { $pull: { thoughts: id } }
            );
            res.json(thought);
        };
        
    } catch (err) {
        console.error("Error in deleteThought: ", err);
        res.status(500).json(err);
    };
};

export const postReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate({
            path: 'username',
            select: 'username'
        });

        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            const {reactionBody, userId} = req.body;
            thought.reactions.push({
                reactionBody: reactionBody,
                username: userId
            } as IReaction);
            await thought.save();
        };
        res.json(thought);
    } catch(err) {
        console.error("Error in deleteReaction: ", err);
        res.status(500).json(err);
    }
};

export const deleteReaction = async (req: Request, res: Response) => {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.body.reactionId;

        console.log(`Deleting reaction with reactionId: ${reactionId}`);

        await Thought.updateOne(
            { _id: thoughtId },
            { $pull: { reactions: {reactionId : reactionId} } }
        );
        res.json({message: 'Deleted reaction!'});
    } catch(err) {
        console.error("Error in postReaction: ", err);
        res.status(500).json(err);
    }
};