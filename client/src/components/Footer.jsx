import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
    return (
        <Footer container className="border border-t-8 border-teal-400">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                            <span className="px-2 py-1 bg-gradient-to-r from-slate-800 via-slate-500 to-slate-400 rounded-lg text-white">
                                Gautam's
                            </span>
                            Blogs
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 sm:mt-10 sm:grid-col-3">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://www.google.com'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    More by Gautam
                                </Footer.Link>
                                <Footer.Link
                                    href='/About'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Gautam's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://github.com/Gautampatel917'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href='https://www.instagram.com/everyday_gautam/'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>Privacy Policies</Footer.Link>
                                <Footer.Link href='#'>Terms & Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Gautam's Blogs" year={2024} />
                    <div className="flex gap-6 sm:mt-0 mt-8 sm:justify-center">
                        <Footer.Icon
                            href="#"
                            icon={BsFacebook}
                            aria-label="Follow us on Facebook"
                        />
                        <Footer.Icon
                            href="#"
                            icon={BsInstagram}
                            aria-label="Follow us on Instagram"
                        />
                        <Footer.Icon
                            href="#"
                            icon={BsGithub}
                            aria-label="Follow us on GitHub"
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );
}