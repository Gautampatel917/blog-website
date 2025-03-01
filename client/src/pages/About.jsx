export default function About() {
    return (
        <div className="about min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">About</h1>
            <div className="w-full max-w-4xl bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-300">
                    This is a blog website where users can explore and gain information about various programming languages such as React, Node.js, Next.js, and many more. Users can also like blogs, leave comments, and share their thoughts with the community.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                    Admins have control over managing blog posts, approving user comments, and handling reported content to ensure a high-quality experience.
                </p>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold">About Me</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        We are, a BCA Semester 6 student, and this blog website is my final year project.
                    </p>
                </div>
            </div>
        </div>
    );
}