import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                setImageFileUploadError("File size must be less than 2MB");
                return;
            }

            // Check file type (only images allowed)
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setImageFileUploadError("Only JPEG, PNG, and GIF images are allowed");
                return;
            }

            // If valid, set the file and its URL
            setImageFileUploadError(null);
            setFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadImage = async () => {
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);

            // Upload the image to Cloudinary
            const uploadRes = await axios.post('/api/upload', uploadData);

            if (uploadRes.status === 200) {
                const imageUrl = uploadRes.data.url; // Extract the URL correctly
                setFormData((prevData) => ({
                    ...prevData,
                    image: imageUrl,
                }));
                setImageFileUploadError(null);
                console.log('Image uploaded successfully:', imageUrl); // Log the image URL
            } else {
                console.error('Failed to upload image:', uploadRes.data); // Log the error
                setImageFileUploadError('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload Error:', error); // Log the error
            setImageFileUploadError('Something went wrong. Please try again.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setPublishError(null);
        setLoading(true);

        try {
            const res = await axios.post('/api/post/create', {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                image: formData.image,
            });
            if (res.status === 201) {
                setLoading(false);
                setPublishError(null);
                navigate(`/post/${res.data.slug}`);
                // Handle successful post creation, e.g., redirect or show success message
            } else {
                setLoading(false);
                setPublishError('Failed to create post');
            }
        } catch (error) {
            setLoading(false);
            setPublishError('Something went wrong. Please try again.');
            console.error('Error creating post:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                        <option value='nodejs'>Node.js</option> 
                        <option value='python'>Python</option> 
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput
                        type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>
                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    )
}
