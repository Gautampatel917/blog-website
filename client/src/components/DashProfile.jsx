import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput } from "flowbite-react";
import { updateProfilePicture } from "../redux/user/userSlice";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const filePickerRef = useRef();
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

                const updateResponseText = await updateRes.text(); // Get the response as text
                console.log('Update Response Text:', updateResponseText); // Log the raw response

                if (updateRes.ok) {
                    const updatedUser = JSON.parse(updateResponseText); // Parse the response as JSON
                    console.log('Profile picture updated successfully:', updatedUser);
                    dispatch(updateProfilePicture(updatedUser)); // Update Redux state
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

            <form className="flex flex-col gap-4">
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
                />

                {/* Email field */}
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email@company.in"
                    defaultValue={currentUser.email}
                />

                {/* Password field */}
                <TextInput type="password" id="password" placeholder="password" />

                {/* Update button */}
                <Button type="submit" gradientDuoTone="cyanToBlue" outline>
                    Update
                </Button>
            </form>

            {/* Delete account and sign out links */}
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
        </div>
    );
} 