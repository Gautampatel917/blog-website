// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-18e51.firebaseapp.com",
    projectId: "mern-blog-18e51",
    storageBucket: "mern-blog-18e51.firebasestorage.app",
    messagingSenderId: "709333751097",
    appId: "1:709333751097:web:5a0b56fe9c2084184bc4e8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);