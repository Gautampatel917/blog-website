import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { Sidebar } from 'flowbite-react';
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { HiArrowSmRight, HiUser, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi';

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
                {currentUser && currentUser.isAdmin && (
                    <Link to='/dashboard?tab=dash'>
                        <Sidebar.Item
                            active={tab === 'dash' || !tab}
                            icon={HiChartPie}
                            as='div'
                        >
                            Dashboard
                        </Sidebar.Item>
                    </Link>
                )}
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
                {currentUser.isAdmin && (
                    <>
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item
                                active={tab === 'users'}
                                icon={HiOutlineUserGroup}
                                as='div'
                            >
                                Users
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item
                                active={tab === 'comments'}
                                icon={HiAnnotation}
                                as='div'
                            >
                                Comments
                            </Sidebar.Item>
                        </Link>
                    </>
                )}
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    );
}
