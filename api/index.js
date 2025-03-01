import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.router.js';
import postRoutes from './routes/post.route.js';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import commentRoutes from './routes/comment.router.js';
import path from 'path';

const port = process.env.PORT || 3000;
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

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());
/* app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
})); */
app.use(cors({
    origin: ['http://localhost:5173', 'https://blog-website-9l1o.onrender.com'],
    credentials: true,
}))

app.use('/', userRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api', authRouter); // Mount the router at /api

const _dirname = path.resolve();

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

app.use(express.static(path.join(_dirname, '/client/dist')));
app.use("*", (req, res) => {
    res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});