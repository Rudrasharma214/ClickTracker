import { Link } from 'react-router-dom';

const footerLinks = {
    Product: [
        { name: 'Features', href: '#features' },
        { name: 'Analytics', href: '#analytics' },
        { name: 'Dashboard', href: '/dashboard' },
    ],
    Company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Contact', href: '#' },
    ],
    Legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
    ],
};

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">ClickTracker</span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Shorten links, track clicks, and gain insights with powerful analytics.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([group, links]) => (
                        <div key={group}>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                                {group}
                            </h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} ClickTracker. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
