import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        // Retrieve the profile image from local storage
        const storedImage = localStorage.getItem('profileImage');
        if (storedImage) {
            setProfileImage(storedImage);
        } else if (currentUser && currentUser.profilePicture) {
            setProfileImage(currentUser.profilePicture);
        }
    }, [currentUser]);
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            <form className="flex flex-col gap-4">
                <div className="w-32 h-32 self-center cursor-pointer shadow-md-overflow-hidden rounded-full">
                    {profileImage && (
                        <img src={profileImage} alt="user"
                            className="rounded-full w-full h-full object-cover border-8 border-gray-300" />
                    )}
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
    )
}