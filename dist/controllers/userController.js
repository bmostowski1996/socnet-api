// This file contains definitions for methods pertaining to users
import User from '../models/User.js';
// It's worth noting compared to before, we're working with mongoose
// Some of the things we do to work with our database in general will work differently than with Sequelize
// At least, that's what I think
export const getUsers = async (_req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('username');
        if (!user) {
            res.status(404).json({ message: 'No user with that ID' });
        }
        else {
            res.json(user);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
};
