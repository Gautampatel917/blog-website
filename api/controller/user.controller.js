import bcryptjs from 'bcryptjs';
import errorHandler from './errorHandler.js'; // Corrected import statement
import User from '../models/user.model';

export const test = (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
    res.status(200).json({
        message: "Test API is working...",
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You not allow to update this user'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.user.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-z0-9_]+$/)) {
            return next(errorHandler(400, 'Username can only contain lowercase letters, numbers and underscores'));
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {
                set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                },
            }, { new: true });
            const { password, ...rest } = updateUser._doc;
            res.status(200).json(rest);
        }
        catch (error) {
            return next(error);
        }
    }
};