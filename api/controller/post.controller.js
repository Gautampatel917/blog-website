import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
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
            message: 'Please provide all required fields',
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
        category: req.body.category || 'uncategorized',
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getPost = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const userId = req.query.userId;

        const query = {
            ...(userId && { userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        };

        console.log('Query parameters:', query); // Log the query parameters

        const posts = await Post.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments(query);

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error); // Log the error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getPostByUserId = async (req, res, next) => {
    try {
        const userId = req.query.userId; // Use query parameter instead of path parameter
        const posts = await Post.find({ userId });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts by userId:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        if (!req.user.isAdmin && req.user.id !== post.userId.toString()) {
            return next(errorHandler(403, 'You are not allowed to update this post'));
        }

        if (!req.body.title || !req.body.content) {
            return res.status(400).json({
                status: 'failed',
                statusCode: 400,
                message: 'Please provide all required fields',
            });
        }

        const slug = req.body.title
            .split(' ')
            .join('-')
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, '');

        // Get the uploaded image URL from the request body
        const imageUrl = req.body.image;

        post.title = req.body.title;
        post.content = req.body.content;
        post.slug = slug;
        post.image = imageUrl; // Update the image URL
        post.category = req.body.category || 'uncategorized';

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        if (!req.user.isAdmin && req.user.id !== post.userId.toString()) {
            return next(errorHandler(403, 'You are not allowed to delete this post'));
        }
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
};