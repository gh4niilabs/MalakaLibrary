import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [scrollY, setScrollY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!dropdownOpen) return;
        const handler = () => setDropdownOpen(false);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [dropdownOpen]);

    const navLinks = [
        { label: 'About', href: '/about' },
        { label: 'Katalog Buku', href: '/katalog' },
        { label: 'Favorit', href: '/favorit' },
        { label: 'Riwayat', href: '/riwayat' },
    ];

    const avatarUrl = user?.avatar ? `/storage/${user.avatar}` : null;

    return (
        <div className="min-h-screen bg-[#0f0f12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            {/* ── Navbar ── */}
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${
                    scrollY > 20
                        ? 'bg-[#0f0f12]/90 backdrop-blur-2xl shadow-xl shadow-black/40 border-b border-white/[0.04]'
                        : 'bg-[#0f0f12] border-b border-white/[0.04]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center text-white font-bold text-xs select-none shadow-lg shadow-red-800/40 transition-all duration-300 group-hover:shadow-red-700/60 group-hover:scale-105">
                                    ML
                                </div>
                            </div>
                            <span className="text-[17px] text-white leading-tight hidden sm:block tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Malaka <span className="text-amber-400">Library</span>
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = typeof window !== 'undefined' && window.location.pathname === new URL(link.href, window.location.origin).pathname;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-300 ${
                                            isActive
                                                ? 'text-amber-400 bg-amber-500/[0.08]'
                                                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side — Avatar + dropdown */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                                    className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors group"
                                >
                                    {/* Avatar */}
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-amber-500/30 transition-all shadow-md"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold uppercase shadow-md ring-2 ring-white/5 group-hover:ring-amber-500/20 transition-all">
                                            {user.name?.charAt(0) ?? 'U'}
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-[13px] font-medium">{user.name}</span>
                                    <svg className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {dropdownOpen && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 mt-2 w-48 bg-[#161616] rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-white/[0.05]">
                                            <p className="text-[12px] font-semibold text-white/80 truncate">{user.name}</p>
                                            <p className="text-[11px] text-white/30 truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <div className="p-1.5">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-white/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-72 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                        <div className="border-t border-white/[0.05] pt-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-white/[0.05] mt-2 pt-2 space-y-1">
                                <Link href={route('profile.edit')} className="block px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                                    Profile
                                </Link>
                                <Link href={route('logout')} method="post" as="button" className="w-full text-left block px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] rounded-lg transition-colors">
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Optional sub-header */}
            {header && (
                <div className="border-b border-white/[0.04] bg-[#0e0e0e]">
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5">
                        {header}
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
