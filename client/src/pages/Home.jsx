import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch('/api/post/getPost');
            const data = await res.json();
            setPosts(data.posts);
        };
        fetchPosts();
    }, []);
    return (
        <div>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
                <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
                <p className='text-gray-500 text-xs sm:text-sm'>
                    Here you'll find a variety of articles and tutorials on topics such as
                    web development, software engineering, and programming languages.
                </p>
                <Link
                    to='/search'
                    className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
                >
                    View all posts
                </Link>
            </div>
            <div className='p-3 bg-amber-100 dark:bg-slate-700'>
                <CallToAction />
            </div>

            <div className='recent-posts-container'>
                {posts && posts.length > 0 && (
                    <div className='recent-posts mt-8'>
                        <h1 className='text-3xl'>Recent Posts</h1>
                        <div className='post-cards'>
                            {posts.slice(0, 6).map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        {posts.length > 6 && (
                            <Link
                                to={'/search'}
                                className='view-all-posts text-lg
                                text-teal-500 hover:underline text-center'
                            >
                                View all posts
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}