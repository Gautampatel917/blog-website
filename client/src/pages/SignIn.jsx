import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure('Please fill all the fields'));
        }
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            console.log('the data fetched successfully');

            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
            }

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };
    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* left */}
                <div className='flex-1'>
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
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput
                                type='password'
                                placeholder='**********'
                                id='password'
                                onChange={handleChange}
                            />
                        </div>
                        <Button gradientDuoTone="cyanToBlue" type="submit" disabled={loading}>
                            {
                                loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="pl-3">Loading...</span>
                                    </>
                                ) : 'Sign In'
                            }
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Create an account</span>
                        <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
                    </div>
                    {errorMessage &&
                        <div className='mt-5 error' color='failure'>
                            {errorMessage}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}