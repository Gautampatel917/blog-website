import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postId, setPostId] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        try {
            const res = await fetch(`/api/post/delete/${postId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUserPosts(userPosts.filter((post) => post._id !== postId));
                setShowModal(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                            <Table.HeadCell>
                                <span>Delete</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post) => (
                            <Table.Body key={post._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <Button
                                                gradientDuoTone='greenToBlue'
                                                size='sm'
                                                outline
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            gradientDuoTone='redToYellow'
                                            size='sm'
                                            outline
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostId(post._id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No posts available.</p>
            )}

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
            >
                <Modal.Header>Delete Post</Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this post?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="gray"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={handleDeletePost}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}