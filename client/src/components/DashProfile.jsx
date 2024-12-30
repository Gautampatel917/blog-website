import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const filePickerRef = useRef();


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };


    /* const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };
 */

    const uploadImage = async () => {
        // service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*')
        //     }
        //   }
        // }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile])

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            <form className="flex flex-col gap-4">
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div className="w-32 h-32 self-center cursor-pointer shadow-md-overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt='user'
                        className="rounded-full w-full h-full object-cover border-8 border-gray-300"
                    />
                </div>
                <TextInput type="text" id="username" placeholder="username"
                    defaultValue={currentUser.username} />
                <TextInput type="email" id="email" placeholder="email@company.in"
                    defaultValue={currentUser.email} />
                <TextInput type="password" id="password" placeholder="password" />
                <Button type="submit" gradientDuoTone="cyanToBlue" outline>Update</Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
        </div>
    );
}