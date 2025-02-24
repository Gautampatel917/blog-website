export default function Projects() {
    const projects = [
        {
            name: "Real Estate Website(House Treasure)",
            image: "https://res.cloudinary.com/dayruwdmj/image/upload/v1739276180/companyLogo_oo8tmd.svg",
            languages: "php, mysql, css, javascript and html",
            link: "https://github.com/Gautampatel917/house-treasure.git"
        },
        {
            name: "Project Name 2",
            image: "Project Image URL 2",
            languages: "Technologies Used 2",
            link: "Project Link 2"
        },
        {
            name: "Project Name 3",
            image: "Project Image URL 3",
            languages: "Technologies Used 3",
            link: "Project Link 3"
        },
        {
            name: "Project Name 4",
            image: "Project Image URL 4",
            languages: "Technologies Used 4",
            link: "Project Link 4"
        },
        {
            name: "Project Name 5",
            image: "Project Image URL 5",
            languages: "Technologies Used 5",
            link: "Project Link 5"
        },
    ];

    return (
        <div className="projects min-h-screen flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            <div className="w-full max-w-4xl space-y-6">
                {projects.map((project, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                        <img src={project.image} alt={project.name} className="w-full md:w-1/3 object-cover" />
                        <div className="p-6 flex flex-col justify-between">
                            <h2 className="text-2xl font-semibold">{project.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300">Languages: {project.languages}</p>
                            <a href={project.link} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Know More</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
