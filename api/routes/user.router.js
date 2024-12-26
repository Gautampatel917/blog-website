import express from 'express';
import { test } from '../controller/user.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set the Content-Type header
    res.status(200).json({
        message: "API is working...",
    });
});

router.get('/test', test);

export default router;