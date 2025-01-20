import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function UpdatePost() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'uncategorized',
        image: '',
    });
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingPost, setFetchingPost] = useState(true); // Loading state for fetching post
    const [fetchError, setFetchError] = useState(null); // Error state for fetching post
    const navigate = useNavigate();
    const { postId } = useParams();

    // Fetch post data on component mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/post/getpost?postId=${postId}`);
                if (res.status === 200) {
                    const postData = res.data.posts[0]; // Assuming the API returns an array of posts
                    setFormData({
                        title: postData.title,
                        content: postData.content,
                        category: postData.category,
                        image: postData.image,
                    });
                    setFetchError(null);
                } else {
                    setFetchError('Failed to fetch post data');
                }
            } catch (error) {
                setFetchError('Something went wrong. Please try again.');
                console.error('Error fetching post:', error);
            } finally {
                setFetchingPost(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file size and type
            if (selectedFile.size > 2 * 1024 * 1024) {
                setImageUploadError("File size must be less than 2MB");
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setImageUploadError("Only JPEG, PNG, and GIF images are allowed");
                return;
            }
            setFile(selectedFile);
            setImageUploadError(null);
        }
    };

    const handleUploadImage = async () => {
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
            const uploadRes = await axios.post('/api/upload', uploadData);
            if (uploadRes.status === 200) {
                setFormData((prevData) => ({ ...prevData, image: uploadRes.data.url }));
            } else {
                setImageUploadError('Failed to upload image');
            }
        } catch (error) {
            setImageUploadError('Something went wrong. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`/api/post/updatepost/${postId}`, formData);
            if (res.status === 200) {
                navigate(`/post/${res.data.slug}`);
            } else {
                setImageUploadError('Failed to update post');
            }
        } catch (error) {
            setImageUploadError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingPost) {
        return <div className='text-center py-8'>Loading post data...</div>;
    }

    if (fetchError) {
        return <div className='text-center py-8 text-red-500'>{fetchError}</div>;
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Title'
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                    <option value='nodejs'>Node.js</option>
                    <option value='python'>Python</option>
                </Select>
                <FileInput
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
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
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                />
                <Button type='submit' gradientDuoTone='purpleToPink' disabled={loading}>
                    {loading ? 'Updating...' : 'Update post'}
                </Button>
                {imageUploadError && (
                    <Alert className='mt-5' color='failure'>
                        {imageUploadError}
                    </Alert>
                )}
            </form>
        </div>
    );
}