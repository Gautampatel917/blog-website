import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const location = useLocation();

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
                <Sidebar.Item active={tab === "profile"} icon={HiUser}>
                    Profile
                </Sidebar.Item>
                <Sidebar.Item icon={HiArrowSmRight}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar>
    );
}
