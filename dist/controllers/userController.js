// This file contains definitions for methods pertaining to users
import User from '../models/User.js';
import Thought from '../models/Thought.js'; // We need this for deleting users...
export const getUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .select('-__v')
            .populate({
            path: 'thoughts',
            select: 'thoughtText'
        })
            .populate({
            path: 'friends',
            select: 'username'
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json(err);
        console.error("Error in getUsers: ", err);
    }
};
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate({
            path: 'thoughts',
            select: 'thoughtText'
        })
            .populate({
            path: 'friends',
            select: 'username'
        });
        if (!user) {
            res.status(404).json({ message: 'No user with that ID' });
        }
        else {
            res.json(user);
        }
    }
    catch (err) {
        console.error("Error in getSingleUser: ", err);
        res.status(500).json(err);
    }
};
export const postUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        // console.log(`Params: ${username}, ${email}`);
        const user = await User.insertOne({
            username: username,
            email: email
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const putUser = async (req, res) => {
    try {
        const result = await User.updateOne({ _id: req.params.userId }, { $set: {
                username: req.body.username,
                email: req.body.email
            }
        });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        ;
        return res.json(result);
    }
    catch (err) {
        console.error("Error in putUser: ", err);
        return res.status(500).json(err);
    }
    ;
};
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        // Delete all thoughts associated with the user
        if (Array.isArray(user.thoughts) && user.thoughts.length > 0) {
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
        }
        ;
        await User.deleteOne({ _id: user._id });
        return res.json(user);
    }
    catch (err) {
        console.error("Error in deleteUser: ", err);
        return res.status(500).json(err);
    }
    ;
};
export const postFriend = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        const friend = await User.findOne({ _id: req.params.friendId });
        if (!user || !friend) {
            return res.status(404).json({ message: 'One or more supplied IDs are invalid' });
        }
        ;
        if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
        }
        if (!friend.friends.includes(user._id)) {
            friend.friends.push(user._id);
        }
        await user.save();
        await friend.save();
        return res.json({
            user: user,
            friend: friend
        });
    }
    catch (err) {
        console.error("Error in postFriend: ", err);
        return res.status(500).json(err);
    }
    ;
};
export const deleteFriend = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        const friend = await User.findOne({ _id: req.params.friendId });
        if (!user || !friend) {
            return res.status(404).json({ message: 'One or more supplied IDs are invalid' });
        }
        ;
        await User.updateOne({ _id: user._id }, { $pull: { friends: friend._id } });
        await User.updateOne({ _id: friend._id }, { $pull: { friends: user._id } });
        await user.save();
        await friend.save();
        return res.json({
            user: user,
            friend: friend
        });
    }
    catch (err) {
        console.error("Error in deleteFriend: ", err);
        return res.status(500).json(err);
    }
    ;
};
