import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const { user } = resultFromGoogle; // Get user object
            const { displayName, email, photoURL } = user; // Destructure photoURL

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: displayName,
                    email,
                    googlePhotoUrl: photoURL,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('profileImage', photoURL); // Store photoURL
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Button type="button" gradientDuoTone="greenToBlue" outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className="w-6 h-6 mr-1" />
            Continue with Google
        </Button>
    )
}