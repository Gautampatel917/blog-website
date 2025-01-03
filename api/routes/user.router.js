import express from 'express';
import { updateUser, test } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Default API route
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: "API is working..." });
});

// Test route
router.get('/test', test);

// Protected route: update user
router.put('/update/:userId', verifyToken, updateUser);

export default router;