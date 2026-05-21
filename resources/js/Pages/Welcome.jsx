import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppNavbar from '@/Components/AppNavbar';
import AppFooter from '@/Components/AppFooter';

export default function Welcome({ auth, popularBooks = [], latestReviews = [] }) {
    const [mounted, setMounted] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleHeroMouse = (e) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    const featureCards = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            ),
            title: 'Katalog Buku',
            desc: 'Jelajahi ribuan koleksi buku dari berbagai kategori. Cari berdasarkan judul, pengarang, atau genre.',
            href: '/katalog',
            cta: 'Cari Buku',
            accent: 'amber',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
            ),
            title: 'Favorit',
            desc: 'Simpan buku yang ingin kamu baca nanti. Buat daftar favorit personalmu dengan mudah.',
            href: '/favorit',
            cta: 'Lihat Favorit',
            accent: 'red',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                </svg>
            ),
            title: 'Riwayat Peminjaman',
            desc: 'Pantau semua buku yang pernah kamu pinjam. Lihat status pengembalian dan denda secara real-time.',
            href: '/riwayat',
            cta: 'Cek Riwayat',
            accent: 'amber',
        },
    ];

    const accentStyles = {
        amber: {
            iconBg: 'bg-amber-500/10 border-amber-500/15 group-hover:bg-amber-500/20',
            iconColor: 'text-amber-400',
            ctaColor: 'text-amber-400',
            hoverBorder: 'hover:border-amber-500/25',
            glowFrom: 'from-amber-500/5',
        },
        red: {
            iconBg: 'bg-red-500/10 border-red-500/15 group-hover:bg-red-500/20',
            iconColor: 'text-red-400',
            ctaColor: 'text-red-400',
            hoverBorder: 'hover:border-red-500/25',
            glowFrom: 'from-red-500/5',
        },
    };

    return (
        <>
            <Head title="Malaka Library">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    body { font-family: 'Inter', sans-serif; margin: 0; background: #0f0f12; }
                    .font-display { font-family: 'Playfair Display', serif; }

                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(28px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes grain {
                        0%, 100% { transform: translate(0,0); }
                        10% { transform: translate(-2%,-2%); }
                        30% { transform: translate(3%,1%); }
                        50% { transform: translate(-1%,3%); }
                        70% { transform: translate(2%,-3%); }
                        90% { transform: translate(-3%,2%); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-6px) rotate(0.5deg); }
                        66% { transform: translateY(3px) rotate(-0.5deg); }
                    }
                    @keyframes borderGlow {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.7; }
                    }
                    .fade-up-1 { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                    .fade-up-2 { animation: fadeUp 0.7s 0.12s cubic-bezier(0.16,1,0.3,1) both; }
                    .fade-up-3 { animation: fadeUp 0.7s 0.24s cubic-bezier(0.16,1,0.3,1) both; }
                    .fade-up-4 { animation: fadeUp 0.7s 0.36s cubic-bezier(0.16,1,0.3,1) both; }

                    .grain::before {
                        content: '';
                        position: absolute;
                        inset: -50%;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                        animation: grain 8s steps(10) infinite;
                        pointer-events: none;
                        z-index: 0;
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-[#0f0f12] text-white selection:bg-amber-500/30 selection:text-white">

            <AppNavbar auth={auth} />

                {/* ── Hero ── */}
                <section
                    ref={heroRef}
                    onMouseMove={handleHeroMouse}
                    className="relative overflow-hidden grain"
                    style={{ minHeight: '85vh' }}
                >
                    {/* Dynamic mouse-follow glow */}
                    <div
                        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-[800ms] ease-out"
                        style={{
                            left: `${mousePos.x}%`,
                            top: `${mousePos.y}%`,
                            transform: 'translate(-50%, -50%)',
                            background: `radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(220,38,38,0.03) 40%, transparent 70%)`,
                        }}
                    />

                    {/* Static ambient lights */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-red-700/[0.07] rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-amber-600/[0.05] rounded-full blur-[100px]" />
                        <div className="absolute top-[60%] left-[60%] w-[200px] h-[200px] bg-red-500/[0.04] rounded-full blur-[80px]" />
                    </div>

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.015]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                    <div className="relative flex items-center justify-center px-5" style={{ minHeight: '85vh' }}>
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <div className="fade-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-amber-400/90 text-[11px] font-semibold tracking-[0.2em] uppercase">Perpustakaan Digital</span>
                            </div>

                            <h1 className="fade-up-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] mb-7 tracking-tight">
                                <span className="text-white">Malaka</span>{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">Library</span>
                                </span>
                                <br />
                                <span className="text-white/80 text-[clamp(1.2rem,3vw,2rem)] font-display font-normal italic mt-2 block">
                                    Perpustakaan Pencerdas Anak Bangsa
                                </span>
                            </h1>

                            <p className="fade-up-3 text-white/35 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light">
                                Temukan ribuan koleksi buku, kelola peminjaman, dan catat buku favoritmu — semua dalam satu tempat.
                            </p>

                            <div className="fade-up-4 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/katalog"
                                    className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-xl shadow-red-900/30 hover:shadow-red-800/50 transition-all duration-300 text-sm hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
                                >
                                    <span className="relative z-10">Lihat Katalog Buku</span>
                                    <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>
                                {!auth?.user && (
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.03] font-medium px-8 py-3.5 rounded-2xl transition-all duration-300 text-sm"
                                    >
                                        Daftar Gratis
                                    </Link>
                                )}
                            </div>

                            {/* Scroll indicator */}
                            <div className="fade-up-4 mt-16 flex justify-center">
                                <div className="w-5 h-9 rounded-full border border-white/10 flex justify-center pt-2" style={{ animation: 'float 3s ease-in-out infinite' }}>
                                    <div className="w-1 h-2 rounded-full bg-amber-400/50 animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="relative border-y border-white/[0.04] bg-[#0e0e0e]">
                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 sm:divide-x sm:divide-white/[0.05]">
                        {[
                            { num: '50+', label: 'Judul Buku', color: 'text-amber-400' },
                            { num: '340+', label: 'Anggota Aktif', color: 'text-red-400' },
                            { num: '18', label: 'Kategori', color: 'text-amber-400' },
                            { num: '24/7', label: 'Akses Online', color: 'text-red-400' },
                        ].map((s, i) => (
                            <div key={s.label} className={`text-center px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 100 + 200}ms` }}>
                                <p className={`font-display text-3xl sm:text-4xl ${s.color}`}>{s.num}</p>
                                <p className="text-white/25 text-[11px] mt-2 tracking-[0.12em] uppercase font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Feature Cards ── */}
                <section className="py-24 relative">
                    {/* Subtle background accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-800/[0.03] rounded-full blur-[150px]" />

                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                        <div className={`mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-400/70">Fitur</span>
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">Apa yang bisa kamu lakukan?</h2>
                            <p className="text-white/30 mt-3 text-sm max-w-md leading-relaxed">Semua fitur yang kamu butuhkan untuk pengalaman membaca terbaik, tersedia di sini.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {featureCards.map((card, i) => {
                                const style = accentStyles[card.accent];
                                return (
                                    <Link
                                        key={card.title}
                                        href={card.href}
                                        onMouseEnter={() => setHoveredCard(i)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className={`group relative bg-[#111111]/80 border border-white/[0.04] ${style.hoverBorder} rounded-2xl p-7 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-1.5 ${
                                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                        style={{ transitionDelay: `${i * 120 + 400}ms` }}
                                    >
                                        {/* Hover gradient overlay */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${style.glowFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                        {/* Corner decoration */}
                                        <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                            <div className="absolute top-3 right-3 w-8 h-[1px] bg-gradient-to-l from-amber-500/30 to-transparent" />
                                            <div className="absolute top-3 right-3 w-[1px] h-8 bg-gradient-to-b from-amber-500/30 to-transparent" />
                                        </div>

                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${style.iconBg} ${style.iconColor} transition-all duration-300`}>
                                                {card.icon}
                                            </div>
                                        </div>
                                        <div className="relative flex-1">
                                            <h3 className="font-display text-lg text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">{card.title}</h3>
                                            <p className="text-white/30 text-sm leading-relaxed">{card.desc}</p>
                                        </div>
                                        <span className={`relative text-sm font-semibold mt-auto flex items-center gap-2 ${style.ctaColor} group-hover:gap-3 transition-all duration-300`}>
                                            {card.cta}
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Popular Books ── */}
                {popularBooks.length > 0 && (
                    <section className="py-20 relative bg-[#0e0e10]">
                        <div className="absolute top-0 left-0 w-full h-full"><div className="absolute top-[20%] right-[20%] w-[350px] h-[350px] bg-red-800/[0.04] rounded-full blur-[120px]" /></div>
                        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                            <div className={`mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-red-400/70">Populer</span>
                                </div>
                                <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">Buku Terpopuler</h2>
                                <p className="text-white/30 mt-3 text-sm max-w-md leading-relaxed">Buku-buku yang paling banyak dipinjam oleh anggota perpustakaan.</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                {popularBooks.map((book, i) => (
                                    <Link key={book.id} href="/katalog" className={`group bg-[#141416] border border-white/[0.04] hover:border-amber-500/15 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay:`${i*80+300}ms`}}>
                                        <div className="aspect-[3/4] bg-gradient-to-br from-red-900/20 to-amber-900/10 flex items-center justify-center">
                                            {book.cover ? <img src={book.cover} alt={book.title} className="w-full h-full object-cover" /> : (
                                                <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition-colors">{book.title}</h4>
                                            <p className="text-white/30 text-[10px] truncate mt-0.5">{book.author}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Latest Reviews ── */}
                {latestReviews.length > 0 && (
                    <section className="py-20 relative">
                        <div className="absolute top-0 left-0 w-full h-full"><div className="absolute bottom-[20%] left-[15%] w-[350px] h-[350px] bg-amber-800/[0.03] rounded-full blur-[120px]" /></div>
                        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                            <div className={`mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-[2px] bg-gradient-to-r from-amber-500 to-red-500 rounded-full" />
                                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-400/70">Testimoni</span>
                                </div>
                                <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">Ulasan Terbaru</h2>
                                <p className="text-white/30 mt-3 text-sm max-w-md leading-relaxed">Apa kata anggota kami tentang buku di Malaka Library.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {latestReviews.map((rev, i) => (
                                    <div key={rev.id} className={`bg-[#141416] border border-white/[0.04] rounded-2xl p-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay:`${i*120+400}ms`}}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold text-white">{rev.user_name?.charAt(0)}</div>
                                            <div><p className="text-sm font-semibold text-white">{rev.user_name}</p><p className="text-[10px] text-white/30">{rev.created_at}</p></div>
                                        </div>
                                        <div className="text-amber-400 text-sm mb-2">{'⭐'.repeat(rev.rating)}</div>
                                        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{rev.comment}</p>
                                        <p className="text-white/20 text-xs mt-3 italic">— {rev.book_title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── CTA Section ── */}
                {!auth?.user && (
                    <section className="relative py-24 px-5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/[0.06] to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[120px]" />

                        <div className="relative max-w-xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/10 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                Bergabung Sekarang
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4 tracking-tight">Mulai perjalanan membacamu</h2>
                            <p className="text-white/30 text-sm mb-8 leading-relaxed">Daftar gratis dan akses semua fitur Malaka Library.</p>
                            <Link
                                href={route('register')}
                                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-xl shadow-red-900/30 hover:shadow-red-800/50 transition-all duration-300 text-sm hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
                            >
                                <span className="relative z-10">Buat Akun Sekarang</span>
                                <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* ── Footer ── */}
                <AppFooter />

            </div>
        </>
    );
}