import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPost from '../components/DashPost';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParam = new URLSearchParams(location.search);
        const tabFromUrl = urlParam.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search]);
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                {/* Sidebar */}
                <DashSidebar />
            </div>
            {/* profile... */}
            {tab === 'profile' && <DashProfile />}
            {/* posts... */}
            {tab === 'posts' && <DashPost />}
            {/* users... */}
            {tab === 'users' && <DashUsers />}
            {/* comments... */}
            {tab === 'comments' && <DashComments />}
            {/* dashboard... */}
            {tab === 'dash' && <DashboardComp />}
        </div>
    )
}