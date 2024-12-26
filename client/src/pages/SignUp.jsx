import { Link, useNavigate } from "react-router-dom";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import OAuth from "../components/OAuth";

export default function SignUp() {
    //useState use for initialize state of the value like empty object or null value.
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Get value of the form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if all fields are filled
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields');
        }
        try {
            setLoading(true); // Optional: Indicate loading state
            setErrorMessage(null);

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.statusCode === 400) {
                console.log(data);
                return setErrorMessage(data.message);
            } else {
                setLoading(false);
                setErrorMessage(null);
                navigate('/sign-in');
                // Handle successful signup, e.g., redirect or show success message
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left side */}
                <div className="flex-1">
                    <Link to="/" className="whitespace-nowrap text-4xl font-semibold dark:text-white">
                        <span className="px-2 py-1 bg-gradient-to-r from-slate-800 via-slate-500 to-slate-400 rounded-lg text-white">
                            Gautam's
                        </span>
                        Blogs
                    </Link>
                    <p className="text-sm mt-5">
                        Sign up for a personalized experience and unlock exclusive features!
                    </p>
                </div>
                {/* Right side */}
                <div className="flex-1">
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <Label value="Your username" />
                            <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your email" />
                            <TextInput type="email" placeholder="name@xyz.com" id="email" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput type="password" placeholder="Password" id="password" onChange={handleChange} />
                        </div>
                        <Button gradientDuoTone="cyanToBlue" type="submit" disabled={loading}>
                            {
                                loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="pl-3">Loading...</span>
                                    </>
                                ) : 'Sign Up'
                            }
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Already have an account?</span>
                        <Link to='/sign-in' className="text-blue-500">Sign in</Link>
                    </div>
                    {errorMessage && (
                        <div className="mt-5 text-red-500">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
