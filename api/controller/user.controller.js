import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
    res.status(200).json({
        message: "Test API is working...",
    });
};

export const updateUser = async (req, res, next) => {
    console.log('Request user:', req.user); // Log the req.user object

    // Fetch the user details from the database
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(errorHandler(404, 'User not found'));
    }

    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You not allow to update this user'));
    }
    if (req.body.password) {
        if (req.body.password.length < 5) {
            return next(errorHandler(400, 'Password must be at least 5 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        /* if (req.body.username !== user.username.toLowerCase()) {
            return next(errorHandler(400, 'Username cannot be changed'));
        } */
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out');
    } catch (error) {
        next(error);
    }
};