import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getPost, deletePost, updatePost, getPostByUserId } from '../controller/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getpost', getPost);
router.put('/updatepost/:postId', verifyToken, updatePost);
router.get('/getpost/:userId', getPostByUserId); // Route for fetching posts by userId
router.delete('/deletepost/:postId/:userId', verifyToken, deletePost);

export default router;