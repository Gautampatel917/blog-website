import express from 'express';
import { signUp, signIn, google } from '../controller/auth.controller.js';

const router = express.Router();

// POST route for user sign-up
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);

export default router;