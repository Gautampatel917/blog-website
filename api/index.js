import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.router.js'

const app = express();
dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('mongoose connection error: ', err);
    })

app.use(express.json());
app.use('/', userRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

//error middleware for handling 
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        status: 'failed',
        statusCode,
        message: message
    })
})

app.listen(3000, '127.0.0.1', () => {
    console.log('App running in http://127.0.0.1:3000');
})