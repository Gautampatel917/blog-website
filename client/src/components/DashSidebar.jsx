import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { Sidebar } from 'flowbite-react';
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { HiArrowSmRight, HiUser, HiDocumentText } from 'react-icons/hi';

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

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

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    return (
        <Sidebar className="w-full md:w-55">
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === "profile"} icon={HiUser}
                        label={currentUser.isAdmin ? 'Admin' : 'User'}
                        labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {currentUser.isAdmin && (
                    <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item
                            active={tab === 'posts'}
                            icon={HiDocumentText}
                            as='div'
                        >
                            Posts
                        </Sidebar.Item>
                    </Link>
                )}
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    );
}
