// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-72290.firebaseapp.com",
    projectId: "mern-blog-72290",
    storageBucket: "mern-blog-72290.firebasestorage.app",
    messagingSenderId: "989169792029",
    appId: "1:989169792029:web:02d571bc7323b4d722c2f4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
