import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { url } = usePage();

    const navLinks = [
        { name: 'Home', href: route('welcome'), icon: '🏠' },
        { name: 'Katalog Buku', href: '#', icon: '📚' },
        { name: 'About', href: '#', icon: 'ℹ️' },
        { name: 'Favorit', href: '#', icon: '⭐' },
        { name: 'Riwayat', href: '#', icon: '📋' },
    ];

    return (
        <nav className="bg-white shadow-lg dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Perpustakaan
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                            : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                    }`}
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profile Button */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition text-sm font-medium"
                        >
                            <span>👤</span>
                            <span>Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
