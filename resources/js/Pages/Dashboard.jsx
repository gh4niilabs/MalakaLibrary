import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppNavbar from '@/Components/AppNavbar';
import AppFooter from '@/Components/AppFooter';

export default function Dashboard({ auth }) {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('visi');
    const [scrollY, setScrollY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const heroRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleHeroMouse = (e) => { 
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <>
            <Head>
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
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 0.6; transform: scale(1.08); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes borderDraw {
                        from { stroke-dashoffset: 1000; }
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes grain {
                        0%, 100% { transform: translate(0,0); }
                        10% { transform: translate(-2%,-2%); }
                        30% { transform: translate(3%,1%); }
                        50% { transform: translate(-1%,3%); }
                        70% { transform: translate(2%,-3%); }
                        90% { transform: translate(-3%,2%); }
                    }

                    .float-anim { animation: float 4s ease-in-out infinite; }
                    .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
                    .shimmer-text {
                        background: linear-gradient(90deg, #ef4444, #f59e0b, #fbbf24, #f59e0b, #ef4444);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        animation: shimmer 5s linear infinite;
                    }

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

                <AppNavbar auth={auth} title="About - Malaka Library" />

                {/* ── Hero Banner ── */}
                <section
                    ref={heroRef}
                    onMouseMove={handleHeroMouse}
                    className="relative overflow-hidden grain py-20 sm:py-28"
                >
                    {/* Dynamic mouse-follow glow */}
                    <div
                        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-[800ms] ease-out"
                        style={{
                            left: `${mousePos.x}%`,
                            top: `${mousePos.y}%`,
                            transform: 'translate(-50%, -50%)',
                            background: `radial-gradient(circle, rgba(245,158,11,0.05) 0%, rgba(220,38,38,0.03) 40%, transparent 70%)`,
                        }}
                    />

                    {/* Static ambient lights */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-red-700/[0.06] rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] right-[15%] w-[300px] h-[300px] bg-amber-600/[0.04] rounded-full blur-[100px]" />
                    </div>

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.012]" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />

                    <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
                        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-amber-400/90 text-[11px] font-semibold tracking-[0.2em] uppercase">About</span>
                            </div>
                        </div>

                        <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5 tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            {auth?.user ? (
                                <>Selamat Datang,{' '}<span className="shimmer-text">{auth.user.name}</span></>
                            ) : (
                                <>Tentang{' '}<span className="shimmer-text">Malaka Library</span></>
                            )}
                        </h1>

                        <p className={`text-white/35 text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-light transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            Senang melihatmu kembali di Malaka Library. Kembali untuk membuka jendela dunia melalui buku, menjelajahi pengetahuan, dan menemukan petualangan baru. Ayo mulai membaca!
                        </p>
                    </div>
                </section>

                {/* ── Visi & Misi Section ── */}
                <section className="relative py-20 sm:py-28">
                    {/* Background accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/[0.03] rounded-full blur-[150px]" />

                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">

                        {/* Section Header */}
                        <div className={`text-center mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/[0.07] border border-red-500/10 text-red-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
                                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Tentang Kami
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
                                Visi & Misi{' '}
                                <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">Malaka Library</span>
                            </h2>
                            <p className="text-white/25 text-sm max-w-md mx-auto leading-relaxed">
                                Membangun bangsa melalui literasi dan digitalisasi perpustakaan
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className={`flex justify-center mb-12 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex bg-white/[0.03] rounded-2xl p-1.5 border border-white/[0.05] backdrop-blur-sm">
                                {['visi', 'misi'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative px-10 py-3 rounded-xl text-sm font-semibold transition-all duration-400 ${
                                            activeTab === tab
                                                ? 'text-white'
                                                : 'text-white/40 hover:text-white/70'
                                        }`}
                                    >
                                        {/* Active background */}
                                        {activeTab === tab && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-amber-700 rounded-xl shadow-lg shadow-red-900/30" />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {tab === 'visi' ? '🔭' : '🚀'} {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Cards */}
                        <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                            {/* Visi Card */}
                            <div className={`transition-all duration-600 ease-out ${activeTab === 'visi' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-4 absolute pointer-events-none'}`}>
                                <div className="relative group">
                                    {/* Outer glow */}
                                    <div className="absolute -inset-px bg-gradient-to-r from-red-600/20 via-amber-500/10 to-red-600/20 rounded-[26px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="relative bg-[#111111]/90 backdrop-blur-sm border border-white/[0.05] rounded-3xl overflow-hidden">
                                        {/* Top accent bar */}
                                        <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />

                                        <div className="p-8 sm:p-12 lg:p-16">
                                            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                                                {/* Icon */}
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-red-900/30 via-red-800/20 to-amber-900/20 border border-red-500/[0.08] flex items-center justify-center float-anim">
                                                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </div>
                                                        {/* Pulse rings */}
                                                        <div className="absolute inset-0 rounded-3xl border border-red-500/10 pulse-glow" />
                                                        <div className="absolute -inset-3 rounded-[28px] border border-amber-500/[0.05] pulse-glow" style={{ animationDelay: '1s' }} />
                                                    </div>
                                                </div>

                                                {/* Text */}
                                                <div className="text-center lg:text-left flex-1">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/10 text-amber-400 text-[11px] font-semibold tracking-widest uppercase mb-5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        VISI KAMI
                                                    </div>
                                                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white mb-6 leading-snug tracking-tight">
                                                        Mencerdaskan <span className="text-amber-400">Anak Bangsa</span>
                                                    </h3>
                                                    <p className="text-white/35 text-base sm:text-lg leading-relaxed max-w-2xl">
                                                        Visi Malaka Library adalah{' '}
                                                        <span className="text-white/80 font-medium">
                                                            untuk mencerdaskan anak bangsa dan menaikan minat baca seluruh rakyat Indonesia.
                                                        </span>
                                                    </p>
                                                    {/* Decorative bar */}
                                                    <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                                                        <div className="w-10 h-[2px] bg-gradient-to-r from-red-500 via-amber-500 to-transparent rounded-full" />
                                                        <span className="text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase">Malaka Library</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Misi Card */}
                            <div className={`transition-all duration-600 ease-out ${activeTab === 'misi' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-4 absolute pointer-events-none'}`}>
                                <div className="relative group">
                                    {/* Outer glow */}
                                    <div className="absolute -inset-px bg-gradient-to-r from-amber-600/20 via-red-500/10 to-amber-600/20 rounded-[26px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="relative bg-[#111111]/90 backdrop-blur-sm border border-white/[0.05] rounded-3xl overflow-hidden">
                                        {/* Top accent bar */}
                                        <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />

                                        <div className="p-8 sm:p-12 lg:p-16">
                                            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                                                {/* Icon */}
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-amber-900/25 via-red-800/20 to-red-900/20 border border-amber-500/[0.08] flex items-center justify-center float-anim" style={{ animationDelay: '0.5s' }}>
                                                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-red-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                        </div>
                                                        {/* Pulse rings */}
                                                        <div className="absolute inset-0 rounded-3xl border border-amber-500/10 pulse-glow" />
                                                        <div className="absolute -inset-3 rounded-[28px] border border-red-500/[0.05] pulse-glow" style={{ animationDelay: '1s' }} />
                                                    </div>
                                                </div>

                                                {/* Text */}
                                                <div className="text-center lg:text-left flex-1">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/[0.08] border border-red-500/10 text-red-400 text-[11px] font-semibold tracking-widest uppercase mb-5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        MISI KAMI
                                                    </div>
                                                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white mb-6 leading-snug tracking-tight">
                                                        Digitalisasi <span className="text-red-400">Perpustakaan</span>
                                                    </h3>
                                                    <p className="text-white/35 text-base sm:text-lg leading-relaxed max-w-2xl">
                                                        Misi kami —{' '}
                                                        <span className="text-white/80 font-medium">
                                                            melalui digitalisasi perpustakaan ini, kami berharap Malaka Library bisa mendongkrak minat baca seluruh masyarakat Indonesia.
                                                        </span>
                                                    </p>
                                                    {/* Decorative bar */}
                                                    <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                                                        <div className="w-10 h-[2px] bg-gradient-to-r from-amber-500 via-red-500 to-transparent rounded-full" />
                                                        <span className="text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase">Malaka Library</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                            <div key={s.label} className={`text-center px-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 100 + 600}ms` }}>
                                <p className={`font-display text-3xl sm:text-4xl ${s.color}`}>{s.num}</p>
                                <p className="text-white/25 text-[11px] mt-2 tracking-[0.12em] uppercase font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Quick Actions ── */}
                <section className="py-24 relative">
                    <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-amber-800/[0.02] rounded-full blur-[150px]" />

                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                        <div className={`mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full" />
                                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-400/70">Aksi Cepat</span>
                            </div>
                            <h2 className="font-display text-2xl sm:text-3xl text-white tracking-tight">Langsung menuju tujuanmu</h2>
                            <p className="text-white/25 mt-3 text-sm max-w-md leading-relaxed">Akses cepat ke halaman yang paling sering kamu kunjungi.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {[
                                { icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>), title: 'Katalog Buku', desc: 'Jelajahi koleksi buku dari berbagai kategori.', href: '/katalog', cta: 'Cari Buku', accent: 'amber' },
                                { icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>), title: 'Favorit', desc: 'Simpan buku yang ingin kamu baca nanti.', href: '/favorit', cta: 'Lihat Favorit', accent: 'red' },
                                { icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>), title: 'Edit Profil', desc: 'Kelola informasi akun dan password kamu.', href: route('profile.edit'), cta: 'Kelola Profil', accent: 'amber' },
                            ].map((card, i) => (
                                <Link key={card.title} href={card.href} className={`group relative bg-[#141416] border border-white/[0.04] hover:border-${card.accent === 'amber' ? 'amber' : 'red'}-500/20 rounded-2xl p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1.5 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 120 + 700}ms` }}>
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-${card.accent === 'amber' ? 'amber' : 'red'}-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${card.accent === 'amber' ? 'bg-amber-500/10 border-amber-500/15 text-amber-400 group-hover:bg-amber-500/20' : 'bg-red-500/10 border-red-500/15 text-red-400 group-hover:bg-red-500/20'}`}>{card.icon}</div>
                                        <h3 className="font-display text-lg text-white mb-2 mt-5 group-hover:text-amber-300 transition-colors">{card.title}</h3>
                                        <p className="text-white/30 text-sm leading-relaxed mb-5">{card.desc}</p>
                                        <span className={`text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300 ${card.accent === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>{card.cta}<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Tim Kami ── */}
                <section className="py-20 relative bg-[#0e0e10] border-t border-white/[0.04]">
                    <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-red-800/[0.03] rounded-full blur-[150px]" />
                    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                        <div className={`mb-14 text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/[0.07] border border-red-500/10 text-red-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                                Tim Kami
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">Orang-orang di Balik <span className="text-amber-400">Malaka</span></h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { name: 'Admin Malaka', role: 'Kepala Perpustakaan', color: 'from-red-600 to-red-800' },
                                { name: 'Petugas Perpustakaan', role: 'Staff Layanan', color: 'from-amber-600 to-amber-800' },
                                { name: 'IT Support', role: 'Developer Sistem', color: 'from-red-700 to-amber-700' },
                            ].map((person, i) => (
                                <div key={person.name} className={`text-center bg-[#141416] border border-white/[0.04] rounded-2xl p-8 transition-all duration-700 hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{transitionDelay:`${i*150+300}ms`}}>
                                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center text-2xl font-bold text-white mb-4`}>{person.name.charAt(0)}</div>
                                    <h3 className="text-white font-semibold text-base">{person.name}</h3>
                                    <p className="text-white/30 text-sm mt-1">{person.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Jam Operasional ── */}
                <section className="py-20 relative">
                    <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 relative">
                        <div className={`text-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/[0.07] border border-amber-500/10 text-amber-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
                                🕐 Jam Operasional
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-tight">Kapan Kami <span className="text-red-400">Buka</span>?</h2>
                        </div>
                        <div className={`bg-[#141416] border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
                            <table className="w-full">
                                <tbody>
                                    {[
                                        { day: 'Senin - Jumat', time: '08:00 - 16:00 WIB', open: true },
                                        { day: 'Sabtu', time: '09:00 - 14:00 WIB', open: true },
                                        { day: 'Minggu & Hari Libur', time: 'Tutup', open: false },
                                        { day: 'Akses Online', time: '24/7', open: true },
                                    ].map((row, i) => (
                                        <tr key={row.day} className="border-b border-white/[0.04] last:border-0">
                                            <td className="px-6 py-4 text-sm text-white font-medium">{row.day}</td>
                                            <td className="px-6 py-4 text-sm text-right">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${row.open ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${row.open ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                    {row.time}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Footer ── */}
                <AppFooter />

            </div>
        </>
    );
}