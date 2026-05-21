import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Favorit({ auth, books = [] }) {
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        setMounted(true);
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
            <Head title="Favorit — Malaka Library">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    body { font-family: 'Inter', sans-serif; margin: 0; background: #0f0f12; }
                    .font-display { font-family: 'Playfair Display', serif; }
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(28px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.05); }
                    }
                    .float-anim { animation: float 4s ease-in-out infinite; }
                    .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
                `}</style>
            </Head>

            <div className="min-h-screen bg-[#0f0f12] text-white selection:bg-amber-500/30">

                {/* ── Navbar ── */}
                <header className={`sticky top-0 z-50 transition-all duration-500 ${scrollY > 20 ? 'bg-[#0f0f12]/90 backdrop-blur-2xl shadow-xl shadow-black/40 border-b border-white/[0.04]' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-[68px]">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <img src="/logo.png" alt="Malaka Library" className="w-9 h-9 rounded-xl object-contain select-none shadow-lg shadow-red-800/40 transition-all duration-300 group-hover:scale-105" />
                                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                                </div>
                                <span className="font-display text-[17px] text-white leading-tight hidden sm:block tracking-tight">Malaka <span className="text-amber-400">Library</span></span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link key={link.label} href={link.href} className={`relative px-4 py-2 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-300 ${link.active ? 'text-amber-400 bg-amber-500/[0.08]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'}`}>
                                        {link.label}
                                        {link.active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-amber-400 rounded-full" />}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center gap-2.5">
                                {auth?.user ? (
                                    <Link href={route('profile.edit')} className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold uppercase shadow-md shadow-red-900/30 ring-2 ring-white/5 group-hover:ring-amber-500/20 transition-all">{auth.user.name?.charAt(0) ?? 'U'}</div>
                                        <span className="hidden sm:block text-[13px] font-medium">{auth.user.name}</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="text-[13px] text-white/50 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.04]">Masuk</Link>
                                        <Link href={route('register')} className="text-[13px] bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-5 py-2 rounded-xl hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-900/30 hover:shadow-red-800/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Daftar</Link>
                                    </>
                                )}
                                <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden ml-1 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${mobileOpen ? 'max-h-72 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                            <div className="border-t border-white/[0.06] pt-3 space-y-1">
                                {navLinks.map((link) => (
                                    <Link key={link.label} href={link.href} className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${link.active ? 'text-amber-400 bg-amber-500/[0.08]' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'}`}>{link.label}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Hero Header ── */}
                <section className="relative py-16 sm:py-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] bg-red-700/[0.05] rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-amber-600/[0.04] rounded-full blur-[100px]" />
                    </div>

                    <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/[0.07] border border-red-500/10 text-red-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                Koleksi Favorit
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
                                Buku <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">Favoritmu</span>
                            </h1>
                            <p className="text-white/30 text-sm sm:text-base max-w-lg leading-relaxed">
                                Simpan buku-buku yang ingin kamu baca nanti. Semua koleksi favoritmu tersimpan di sini.
                            </p>
                        </div>

                        {/* View toggle + search placeholder */}
                        <div className={`mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" placeholder="Cari buku favorit..." className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 transition-all" />
                            </div>

                            {/* View toggle */}
                            <div className="inline-flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.05]">
                                {[
                                    { mode: 'grid', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
                                    { mode: 'list', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> },
                                ].map(({ mode, icon }) => (
                                    <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-2 rounded-lg transition-all duration-300 ${viewMode === mode ? 'bg-red-600/80 text-white shadow-md' : 'text-white/30 hover:text-white/60'}`}>{icon}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Content ── */}
                <section className="relative pb-24">
                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">

                        {/* Empty State */}
                        {books.length === 0 && (
                            <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="relative bg-[#111111]/80 border border-white/[0.04] rounded-3xl overflow-hidden">
                                    <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/[0.02] rounded-full blur-[80px]" />

                                    <div className="relative py-20 sm:py-28 flex flex-col items-center text-center px-6">
                                        {/* Icon */}
                                        <div className="relative mb-8">
                                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-red-900/30 via-red-800/20 to-amber-900/15 border border-red-500/[0.08] flex items-center justify-center float-anim">
                                                <svg className="w-14 h-14 sm:w-16 sm:h-16 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <div className="absolute inset-0 rounded-3xl border border-red-500/10 pulse-glow" />
                                            <div className="absolute -inset-3 rounded-[28px] border border-amber-500/[0.05] pulse-glow" style={{ animationDelay: '1s' }} />
                                        </div>

                                        <h3 className="font-display text-2xl sm:text-3xl text-white mb-3 tracking-tight">
                                            Belum Ada <span className="text-red-400">Favorit</span>
                                        </h3>
                                        <p className="text-white/30 text-sm sm:text-base max-w-md leading-relaxed mb-8">
                                            Kamu belum menambahkan buku ke koleksi favorit. Jelajahi katalog dan temukan buku yang kamu suka!
                                        </p>

                                        <Link
                                            href={route('katalog.index')}
                                            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-700 shadow-lg shadow-red-900/25 hover:shadow-red-800/35 hover:from-red-600 hover:to-amber-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                            Jelajahi Katalog
                                        </Link>

                                        {/* Decorative */}
                                        <div className="mt-10 flex items-center gap-3">
                                            <div className="w-10 h-[2px] bg-gradient-to-r from-red-500 via-amber-500 to-transparent rounded-full" />
                                            <span className="text-white/15 text-[10px] font-semibold tracking-[0.2em] uppercase">Malaka Library</span>
                                            <div className="w-10 h-[2px] bg-gradient-to-l from-red-500 via-amber-500 to-transparent rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grid placeholder — akan terisi saat ada data */}
                        {books.length > 0 && (
                            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                                {books.map((book, i) => (
                                    <div key={book.id || i} className="group relative bg-[#111111]/80 border border-white/[0.04] hover:border-amber-500/15 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                                        <div className="aspect-[3/4] bg-gradient-to-br from-red-900/20 to-amber-900/10 flex items-center justify-center">
                                            {book.cover ? (
                                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-sm font-semibold text-white truncate">{book.title}</h4>
                                            <p className="text-white/30 text-xs mt-1 truncate">{book.author}</p>
                                        </div>
                                        {/* Remove favorite button */}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.post(route('favorites.toggle', book.id), {}, { preserveScroll: true });
                                            }}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-white/[0.04] py-10 px-5 bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="ML" className="w-6 h-6 rounded-md object-contain" />
                            <span className="font-display text-sm text-white/60">Perpustakaan <span className="text-amber-400/70">Digital</span></span>
                        </div>
                        <p className="text-white/20 text-xs">Proyek Tugas — SMK RPL &copy; {new Date().getFullYear()}</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
