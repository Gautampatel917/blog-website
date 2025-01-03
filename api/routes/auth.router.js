import express from 'express';
import { signUp, signIn, google } from '../controller/auth.controller.js';
import multer from 'multer';
import { updateProfilePicture } from '../controller/auth.controller.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Image upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('File received:', req.file); // Log the file object

        const result = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: 'mern-blog', // Use your upload preset name here
        });

        console.log('Uploaded Image URL:', result.secure_url); // Log the URL
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload Error:', error); // Log the error
        res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
});

// Existing routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google', google);
router.post('/update-profile-picture', updateProfilePicture);


export default router;