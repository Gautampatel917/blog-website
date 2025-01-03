import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess,
    updateProfilePicture,
} from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const filePickerRef = useRef();
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();

    // Handle image selection
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
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }
        try {
            dispatch(updateStart());
            console.log('Sending request to update user:', formData); // Log the request data
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include', // Include cookies in the request
            });
            const data = await res.json();
            console.log('Server response:', data); // Log the server response
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Upload image to Cloudinary and update profile picture
    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            // Upload the image to Cloudinary
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log('Upload Response:', uploadRes); // Log the response

            const responseText = await uploadRes.text(); // Get the response as text
            console.log('Response Text:', responseText); // Log the raw response

            if (uploadRes.ok) {
                const { url } = JSON.parse(responseText); // Parse the response as JSON
                console.log('Image uploaded successfully:', url);

                // Update the user's profile picture in the database
                const updateRes = await fetch('/api/auth/update-profile-picture', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser._id,
                        profilePicture: url,
                    }),
                });

                const updateResponseText = await updateRes.text();
                console.log('Update Response Text:', updateResponseText);

                if (updateRes.ok) {
                    const updatedUser = JSON.parse(updateResponseText);
                    console.log('Profile picture updated successfully:', updatedUser);
                    dispatch(updateProfilePicture(updatedUser));
                    setImageFileUploadError(null);
                } else {
                    console.error('Failed to update profile picture:', updateResponseText); // Log the error
                    setImageFileUploadError('Failed to update profile picture');
                }
            } else {
                console.error('Failed to upload image:', responseText); // Log the error
                setImageFileUploadError('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload Error:', error); // Log the error
            setImageFileUploadError('Something went wrong. Please try again.');
        }
    };

    // Automatically upload the image when a file is selected
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Hidden file input for image selection */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />

                {/* Profile picture */}
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => filePickerRef.current.click()}
                >
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className="rounded-full w-full h-full object-cover border-8 border-gray-300"
                    />
                </div>

                {/* Error message */}
                {imageFileUploadError && (
                    <div className="text-red-500 text-center">{imageFileUploadError}</div>
                )}

                {/* Username field */}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />

                {/* Email field */}
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email@company.in"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />

                {/* Password field */}
                <TextInput type="password"
                    id="password"
                    placeholder="password" onChange={handleChange}
                />

                {/* Update button */}
                <Button type="submit" gradientDuoTone="cyanToBlue" outline disabled={loading}>
                    {
                        loading ? (
                            <>
                                <Spinner size="sm" />
                                <span className="pl-3">Loading...</span>
                            </>
                        ) : 'update'
                    }
                </Button>
                {
                    currentUser.isAdmin && (
                        <Link to={'/create-post'}>
                            <Button
                                type="button"
                                gradientDuoTone="redToYellow"
                                className="w-full"
                            >
                                Create a post
                            </Button>
                        </Link>
                    )
                }
            </form>

            {/* Delete account and sign out links */}
            <div className="text-red-500 flex justify-between mt-5">
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>
                    Delete Account
                </span>
                <span onClick={handleSignout} className='cursor-pointer'>
                    Sign Out
                </span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color='failure' className='mt-5'>
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}