import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AppNavbar({ auth, title = '' }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Beranda', href: '/', active: route().current('home') },
        { label: 'Tentang Kami', href: '/about', active: route().current('about') },
        { label: 'Katalog Buku', href: '/katalog', active: route().current('katalog.index') },
        { label: 'Favorit', href: '/favorit', active: route().current('favorit') },
        { label: 'Riwayat', href: '/riwayat', active: route().current('riwayat') },
    ];

    return (
        <>
            {title && <Head title={title} />}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-[#2A2A2A] bg-[#0F0F0F]">
                <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Malaka Library" className="h-8 w-auto object-contain" />
                        <span className="font-headline-sm text-headline-sm tracking-normal text-white">Malaka Library</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} className={`border-b-2 pb-1 font-body-md text-body-md transition-colors ${link.active ? 'border-[#FACC15] text-white' : 'border-transparent text-[#A3A3A3] hover:text-white'}`}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link href={route('profile.edit')} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffb4ab] font-label-md text-label-md font-semibold text-[#690005]" aria-label="Profil">
                                {auth.user.name?.charAt(0) ?? 'U'}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-2 py-1 font-label-md text-label-md text-white transition-colors hover:text-[#e6bdb8]">Masuk</Link>
                                <Link href={route('register')} className="rounded-md bg-[#DC2626] px-4 py-2 font-label-md text-label-md font-medium text-white transition-colors hover:bg-[#B91C1C]">Daftar</Link>
                            </>
                        )}
                        <button type="button" className="border border-[#2A2A2A] px-2 py-1 font-label-md text-label-md text-[#A3A3A3] md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label="Buka menu">
                            MENU
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <nav className="border-t border-[#2A2A2A] bg-[#0F0F0F] px-4 py-3 md:hidden">
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} className="block border-b border-[#2A2A2A] py-3 font-body-md text-body-md text-[#A3A3A3] last:border-b-0 hover:text-white">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>
        </>
    );
}
