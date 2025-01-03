import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Mongoose connection error: ', err);
    });

const app = express();
app.use(express.json());
app.use(cookieParser()); // Use cookieParser middleware before defining routes
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
}));

app.use('/', userRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api', authRouter); // Mount the router at /api

// Error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        status: 'failed',
        statusCode,
        message: message,
    });
});

app.listen(3000, '127.0.0.1', () => {
    console.log('App running in http://127.0.0.1:3000');
});