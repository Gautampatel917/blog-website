import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            status: 'failed',
            statusCode: 403,
            message: 'You are not authorized to create a post',
        });
    }
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: 'Please provide all require fields',
        });
    }
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    // Get the uploaded image URL from the request body
    const imageUrl = req.body.image;

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
        image: imageUrl, // Store the uploaded image URL
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}
