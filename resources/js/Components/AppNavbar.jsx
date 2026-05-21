import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AppNavbar({ auth, title = '' }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', href: '/', active: route().current('home') },
        { label: 'About', href: '/about', active: route().current('about') },
        { label: 'Katalog Buku', href: '/katalog', active: route().current('katalog.index') },
        { label: 'Favorit', href: '/favorit', active: route().current('favorit') },
        { label: 'Riwayat', href: '/riwayat', active: route().current('riwayat') },
    ];

    return (
        <>
            {title && <Head title={title} />}
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${
                    scrollY > 20
                        ? 'bg-[#0f0f12]/90 backdrop-blur-2xl shadow-xl shadow-black/40 border-b border-white/[0.04]'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img src="/logo.png" alt="Malaka Library" className="w-9 h-9 rounded-xl object-contain select-none shadow-lg shadow-red-800/40 transition-all duration-300 group-hover:scale-105" />
                                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                            </div>
                            <span className="font-display text-[17px] text-white leading-tight hidden sm:block tracking-tight">
                                Malaka <span className="text-amber-400">Library</span>
                            </span>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-300 ${
                                        link.active
                                            ? 'text-amber-400 bg-amber-500/[0.08]'
                                            : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {link.label}
                                    {link.active && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-amber-400 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Profile / Auth */}
                        <div className="flex items-center gap-2.5">
                            {auth?.user ? (
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold uppercase shadow-md shadow-red-900/30 ring-2 ring-white/5 group-hover:ring-amber-500/20 transition-all">
                                        {auth.user.name?.charAt(0) ?? 'U'}
                                    </div>
                                    <span className="hidden sm:block text-[13px] font-medium">{auth.user.name}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-[13px] text-white/50 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.04]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-[13px] bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-5 py-2 rounded-xl hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-900/30 hover:shadow-red-800/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden ml-1 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <div className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${mobileOpen ? 'max-h-72 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                        <div className="border-t border-white/[0.06] pt-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${
                                        link.active
                                            ? 'text-amber-400 bg-amber-500/[0.08]'
                                            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
