import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    return (
        <div className='w-full md:w-1/2 xl:w-1/3 p-6'>
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt='post cover'
                    className='h-48 w-full object-cover'
                />
            </Link>
            <div className='pt-3'>
                <h2 className='text-lg font-bold'>{post.title}</h2>
                <p className='text-gray-500'>{post.category}</p>
            </div>
        </div>
    );
}