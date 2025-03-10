import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (
        !username ||
        !email ||
        !password ||
        username === '' ||
        email === '' ||
        password === ''
    ) {
        next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
    });

    try {
        await newUser.save();
        res.json('Signup successful');
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User   not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;

        // Set the cookie
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict', // Prevent CSRF attacks
            })
            .json(rest);

        // Log the cookie to confirm it's being set
        console.log('Cookie set:', res.getHeaders()['set-cookie']);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    console.log('Google Authentication Request:', { email, name, googlePhotoUrl }); // Log the request

    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            console.log('User found:', rest); // Log the user data

            // Set the cookie
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict', // Prevent CSRF attacks
                })
                .json(rest);

            // Log the cookie to confirm it's being set
            console.log('Cookie set:', res.getHeaders()['set-cookie']);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username:
                    name.toLowerCase().split(' ').join('') +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                isAdmin: false,
            });

            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            console.log('New user created:', rest); // Log the new user data

            // Set the cookie
            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict', // Prevent CSRF attacks
                })
                .json(rest);

            // Log the cookie to confirm it's being set
            console.log('Cookie set:', res.getHeaders()['set-cookie']);
        }
    } catch (error) {
        console.error('Google Authentication Error:', error); // Log the error
        next(error);
    }
};

export const updateProfilePicture = async (req, res, next) => {
    const { userId, profilePicture } = req.body;

    if (!userId || !profilePicture) {
        return next(errorHandler(400, 'User  ID and profile picture URL are required'));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User  not found'));
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};