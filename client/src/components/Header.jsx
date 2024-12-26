import { Avatar, Dropdown, Navbar, TextInput, Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Header() {
    const path = useLocation().pathname;  // track user for links
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme); // Assuming you have a theme state
    const dispatch = useDispatch();

    //profileImg

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const profileImage = localStorage.getItem('profileImage') || currentUser?.profilePicture;
    console.log(profileImage);

    return (
        <Navbar className="border-b-2">
            <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                <span className="px-2 py-1 bg-gradient-to-r from-slate-800 via-slate-500 to-slate-400 rounded-lg text-white">
                    Gautam's
                </span>
                Blogs
            </Link>
            <form>
                <TextInput
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='grey' pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button className="w-12 h-10 hidden sm:inline" color="grey" pill onClick={handleThemeToggle}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt='user' img={profileImage} rounded />
                            // <Avatar rounded/>
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                            <span className='block text-sm font-medium truncate'>
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => {/* handleSignout logic */ }}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone="cyanToBlue" className="ml-2">Sign In</Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Link to="/" className={path === '/' ? 'font-bold text-blue-400' : ''}>
                    Home
                </Link>
                <Link to="/about" className={path === '/about' ? 'font-bold text-blue-400' : ''}>
                    About
                </Link>
                <Link to="/projects" className={path === '/projects' ? 'font-bold text-blue-400' : ''}>
                    Projects
                </Link>
            </Navbar.Collapse>
        </Navbar >
    );
}