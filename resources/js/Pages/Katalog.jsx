// resources/js/Pages/Katalog.jsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Katalog({ auth, books, categories, filters, flash }) {
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [hoveredBook, setHoveredBook] = useState(null);
    const [activeCategory, setActiveCategory] = useState(filters.category || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [borrowingId, setBorrowingId] = useState(null);

    // Modal states
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [toast, setToast] = useState(null);
    const [overviewBook, setOverviewBook] = useState(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Flash → toast notification
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            setTimeout(() => setToast(null), 5000);
        }
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            setTimeout(() => setToast(null), 5000);
        }
    }, [flash]);

    // Buka modal form peminjaman
    const openBorrowModal = (e, book) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth?.user) {
            setToast({ type: 'error', message: 'Kamu harus login dulu untuk meminjam buku!' });
            setTimeout(() => { setToast(null); router.visit(route('login')); }, 1500);
            return;
        }
        setSelectedBook(book);
        // Default due date = 7 hari dari sekarang
        const d = new Date(); d.setDate(d.getDate() + 7);
        setDueDate(d.toISOString().split('T')[0]);
        setShowBorrowModal(true);
    };

    // Submit peminjaman
    const submitBorrow = () => {
        if (!dueDate) { setToast({ type: 'error', message: 'Pilih tanggal pengembalian!' }); setTimeout(() => setToast(null), 3000); return; }
        setBorrowingId(selectedBook.id);
        const bookSnap = { ...selectedBook, due_date: dueDate, borrow_date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), user_name: auth.user.name };
        router.post(route('loans.store'), { book_id: selectedBook.id, due_date: dueDate }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowBorrowModal(false);
                setReceiptData(bookSnap);
                setShowReceipt(true);
            },
            onFinish: () => setBorrowingId(null),
        });
    };

    // Format tanggal Indonesia
    const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    // Min date = besok
    const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })();

    const navLinks = [
        { label: 'Home', href: '/', active: route().current('home') }, 
        { label: 'About', href: route('about'), active: route().current('about') }, 
        { label: 'Katalog Buku', href: route('katalog.index'), active: route().current('katalog.index') },
        { label: 'Favorit', href: route('favorit'), active: route().current('favorit') },
        { label: 'Riwayat', href: route('riwayat'), active: route().current('riwayat') },
    ];

    // Emoji mapping buat kategori
    const categoryEmojis = ['📚', '🔬', '💡', '🎨', '🌍', '💻', '📖', '🧪'];

    return (
        <>
            <Head title="Katalog Buku - Malaka Library">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    body { font-family: 'Inter', sans-serif; margin: 0; overflow-x: hidden; background: #0f0f12; }
                    .font-display { font-family: 'Playfair Display', serif; }
                    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .grain::before {
                        content: ''; position: absolute; inset: -50%;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
                        pointer-events: none; z-index: 0;
                    }
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}</style>
            </Head>

            <div className="min-h-screen bg-[#0f0f12] text-white selection:bg-amber-500/30 selection:text-white overflow-x-hidden">

                {/* ── Navbar ── */}
                <header className={`sticky top-0 z-50 transition-all duration-500 ${scrollY > 20 ? 'bg-[#0f0f12]/90 backdrop-blur-2xl shadow-xl border-b border-white/[0.04]' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-[68px]">
                            <Link href="/" className="flex items-center gap-3 group">
                                <img src="/logo.png" alt="Malaka Library" className="w-9 h-9 rounded-xl object-contain select-none shadow-lg" />
                                <span className="font-display text-[17px] text-white hidden sm:block tracking-tight">Malaka <span className="text-amber-400">Library</span></span>
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
                                    <Link href={route('profile.edit')} className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold uppercase ring-2 ring-white/5">{auth.user.name?.charAt(0)}</div>
                                        <span className="hidden sm:block text-[13px] font-medium">{auth.user.name}</span>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2.5">
                                        <Link href={route('login')} className="text-[13px] text-white/50 hover:text-white px-4 py-2">Masuk</Link>
                                        <Link href={route('register')} className="text-[13px] bg-red-700 text-white font-semibold px-5 py-2 rounded-xl">Daftar</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ── */}
                <section className="relative py-20 grain border-b border-white/[0.04] overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-red-900/[0.04] rounded-full blur-[120px] pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto px-5 relative z-10">
                        <div className={`text-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-amber-400/90 text-[11px] font-semibold tracking-[0.2em] uppercase">Koleksi Buku</span>
                            </div>
                            <h1 className="font-display text-4xl sm:text-6xl text-white mb-4 tracking-tight">Katalog <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">Buku</span></h1>
                            <p className="text-white/35 text-base max-w-lg mx-auto">Jelajahi koleksi buku kami dari berbagai genre dan kategori</p>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <form className="relative flex items-center bg-[#111111]/90 border border-white/[0.06] rounded-2xl overflow-hidden focus-within:border-amber-500/20 transition-all" onSubmit={(e) => {
                                e.preventDefault();
                                router.get(route('katalog.index'), { search: searchQuery, category: activeCategory }, { preserveState: true });
                            }}>
                                <svg className="w-5 h-5 text-white/20 ml-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari judul buku..." className="flex-1 bg-transparent text-white px-4 py-4 outline-none" />
                                <button type="submit" className="mr-2 px-6 py-2 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-600 transition-all">Cari</button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* ── Main Content ── */}
                <section className="py-12 relative">
                    <div className="max-w-7xl mx-auto px-5">
                        
                        {/* ── Category Slider ── */}
                        <div className="relative mb-10">
                            <div className="flex overflow-x-auto gap-2 pb-4 hide-scrollbar touch-pan-x">
                                <Link href={route('katalog.index', { search: searchQuery })} className={`flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' || !activeCategory ? 'bg-white text-black' : 'bg-white/[0.03] text-white/50 border border-white/[0.04]'}`}>📚 Semua</Link>
                                {categories.map((cat, index) => (
                                    <Link key={cat.id} href={route('katalog.index', { category: cat.slug, search: searchQuery })} className={`flex-none px-5 py-2.5 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2 ${activeCategory === cat.slug ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/[0.03] text-white/50 border border-white/[0.04]'}`}>
                                        <span>{categoryEmojis[index % categoryEmojis.length]}</span>
                                        <span>{cat.name}</span>
                                        {cat.books_count > 0 && <span className="text-[10px] opacity-60">({cat.books_count})</span>}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* ── Book Grid ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {books.map((book, i) => (
                                <div key={book.id} className="group relative bg-[#111111]/80 border border-white/[0.04] hover:border-amber-500/15 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
                                    <div className="relative h-64 overflow-hidden bg-gray-900 flex-shrink-0">
                                        {book.cover ? (
                                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/30 to-amber-900/20">
                                                <svg className="w-16 h-16 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                                            </div>
                                        )}
                                        {/* Status badge */}
                                        {book.available < 1 && (
                                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500/90 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg">
                                                Habis
                                            </div>
                                        )}
                                        {/* Category badges */}
                                        {book.categories && book.categories.length > 0 && (
                                            <div className="absolute top-3 left-3 flex gap-1.5">
                                                {book.categories.slice(0, 2).map((cat) => (
                                                    <span key={cat.id} className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-amber-300 font-medium">{cat.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-display text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">{book.title}</h3>
                                        <p className="text-white/40 text-sm mb-1">{book.author}</p>
                                        <p className="text-white/20 text-xs mb-3">{book.publisher}</p>
                                        
                                        {/* Bagian Tombol dan Ketersediaan */}
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                            <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if(!auth?.user) return router.visit(route('login'));
                                                        router.post(route('favorites.toggle', book.id), {}, { preserveScroll: true });
                                                    }}
                                                    className={`p-1.5 rounded-full transition-all ${book.is_favorited ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10' : 'text-white/20 hover:text-red-400 hover:bg-red-500/10'}`}
                                                >
                                                    <svg className="w-5 h-5" fill={book.is_favorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                                                </button>
                                                <div className={`w-1.5 h-1.5 rounded-full ${book.available > 0 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-400'}`} />
                                                <span className="text-white/40 text-[11px]">
                                                    {book.available > 0 ? `${book.available} tersedia` : 'Kosong'}
                                                </span>
                                            </div>
                                            
                                            {book.available > 0 ? (
                                                <button 
                                                    onClick={(e) => openBorrowModal(e, book)}
                                                    disabled={borrowingId === book.id}
                                                    className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-wait"
                                                >
                                                    {borrowingId === book.id ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <svg className="w-3 h-3" style={{animation: 'spin 1s linear infinite'}} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" /></svg>
                                                            Proses...
                                                        </span>
                                                    ) : 'Pinjam'}
                                                </button>
                                            ) : (
                                                <button disabled className="px-4 py-1.5 bg-white/5 border border-white/5 text-white/30 text-xs font-bold uppercase tracking-wider rounded-lg cursor-not-allowed">
                                                    Habis
                                                </button>
                                            )}
                                            <button onClick={(e) => { e.preventDefault(); setOverviewBook(book); }} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 hover:text-white transition-all">
                                                Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty state */}
                        {books.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-red-900/20 to-amber-900/10 border border-white/[0.05] flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                </div>
                                <h3 className="font-display text-2xl text-white/40 mb-2">Buku tidak ditemukan</h3>
                                <p className="text-white/20 text-sm">Coba ubah kata kunci pencarian atau filter kategori</p>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="border-t border-white/[0.04] py-10 px-5 bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/20 text-xs">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="ML" className="w-6 h-6 rounded-md object-contain" />
                            <span className="font-display text-white/60">Malaka Library</span>
                        </div>
                        <p>&copy; {new Date().getFullYear()} — SMK RPL</p>
                    </div>
                </footer>

                {/* ═══════ TOAST NOTIFICATION ═══════ */}
                {toast && (
                    <div className={`fixed top-6 right-6 z-[9999] max-w-sm px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-[fadeUp_0.4s_ease-out] ${
                        toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300' : 'bg-red-900/90 border-red-500/30 text-red-300'
                    }`}>
                        <div className="flex items-start gap-3">
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ) : (
                                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            )}
                            <p className="text-sm font-medium">{toast.message}</p>
                            <button onClick={() => setToast(null)} className="ml-auto -mt-1 text-white/40 hover:text-white">✕</button>
                        </div>
                    </div>
                )}

                {/* ═══════ MODAL FORM PEMINJAMAN ═══════ */}
                {showBorrowModal && selectedBook && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBorrowModal(false)} />
                        <div className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[fadeUp_0.3s_ease-out]">
                            {/* Header gradient */}
                            <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
                            <div className="p-6">
                                <h3 className="font-display text-xl text-white mb-1">Form Peminjaman</h3>
                                <p className="text-white/40 text-xs mb-6">Isi formulir untuk mengajukan peminjaman buku</p>

                                {/* Book Info */}
                                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-5">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-20 rounded-xl bg-gradient-to-br from-red-900/40 to-amber-900/30 border border-white/5 flex items-center justify-center flex-shrink-0">
                                            {selectedBook.cover ? <img src={selectedBook.cover} className="w-full h-full object-cover rounded-xl" /> : <svg className="w-6 h-6 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{selectedBook.title}</p>
                                            <p className="text-white/40 text-xs mt-0.5">{selectedBook.author}</p>
                                            <p className="text-white/25 text-xs">{selectedBook.publisher}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tanggal Pinjam (otomatis hari ini) */}
                                <div className="mb-4">
                                    <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-1.5">Tanggal Pinjam</label>
                                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white/60 text-sm">
                                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Tanggal Pengembalian */}
                                <div className="mb-6">
                                    <label className="block text-[10px] font-semibold text-amber-400/80 uppercase tracking-widest mb-1.5">Tanggal Pengembalian *</label>
                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={tomorrow} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all" />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button onClick={() => setShowBorrowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Batal</button>
                                    <button onClick={submitBorrow} disabled={borrowingId} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50">
                                        {borrowingId ? 'Memproses...' : '📋 Ajukan Pinjam'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════ BUKTI PEMINJAMAN RECEIPT ═══════ */}
                {showReceipt && receiptData && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowReceipt(false)} />
                        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeUp_0.3s_ease-out]" id="receipt-content">
                            {/* Receipt header */}
                            <div className="bg-gradient-to-r from-red-700 to-red-800 p-6 text-center">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <h3 className="text-white font-bold text-lg">Bukti Peminjaman</h3>
                                <p className="text-white/60 text-xs mt-1">Malaka Library</p>
                            </div>

                            {/* Receipt body */}
                            <div className="p-6 space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Nama Peminjam</span><span className="font-semibold text-gray-800">{receiptData.user_name}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Judul Buku</span><span className="font-semibold text-gray-800 text-right max-w-[200px]">{receiptData.title}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Penulis</span><span className="text-gray-700">{receiptData.author}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Penerbit</span><span className="text-gray-700">{receiptData.publisher}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Tanggal Pinjam</span><span className="text-gray-700">{receiptData.borrow_date}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Tanggal Kembali</span><span className="font-semibold text-red-600">{fmtDate(receiptData.due_date)}</span></div>
                                <div className="flex justify-between py-2"><span className="text-gray-500">Status</span><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">PENDING</span></div>
                            </div>

                            {/* Receipt footer */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button onClick={() => setShowReceipt(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">Tutup</button>
                                <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all">🖨️ Cetak</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* OVERVIEW / SINOPSIS SLIDE PANEL */}
                {overviewBook && (
                    <div className="fixed inset-0 z-[9999]">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOverviewBook(null)} />
                        <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#111] border-l border-white/10 shadow-2xl overflow-y-auto" style={{animation:'slideInRight .3s ease-out'}}>
                            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
                            <button onClick={() => setOverviewBook(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all z-10">✕</button>
                            {/* Cover */}
                            <div className="aspect-[3/2] w-full bg-gradient-to-br from-red-900/30 to-amber-900/20 flex items-center justify-center">
                                {overviewBook.cover ? (
                                    <img src={overviewBook.cover} alt={overviewBook.title} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-20 h-20 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                                )}
                            </div>
                            {/* Info */}
                            <div className="p-6 space-y-5">
                                <div>
                                    <h2 className="font-display text-2xl text-white mb-1">{overviewBook.title}</h2>
                                    <p className="text-white/50 text-sm">{overviewBook.author}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {overviewBook.categories?.map(c => (
                                        <span key={c.id} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold">{c.name}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-[10px] text-white/30 uppercase tracking-widest">Penerbit</p><p className="text-sm text-white mt-1">{overviewBook.publisher || '-'}</p></div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-[10px] text-white/30 uppercase tracking-widest">Tahun</p><p className="text-sm text-white mt-1">{overviewBook.year || '-'}</p></div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-[10px] text-white/30 uppercase tracking-widest">Stok</p><p className="text-sm text-white mt-1">{overviewBook.available} / {overviewBook.stock}</p></div>
                                </div>
                                <div>
                                    <h3 className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Sinopsis</h3>
                                    <p className="text-white/60 text-sm leading-relaxed">{overviewBook.description || 'Belum ada sinopsis untuk buku ini.'}</p>
                                </div>
                                {overviewBook.available > 0 && (
                                    <button onClick={() => { const book = overviewBook; setOverviewBook(null); openBorrowModal({preventDefault:()=>{},stopPropagation:()=>{}}, book); }} className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-bold rounded-xl hover:from-red-500 hover:to-amber-500 shadow-lg transition-all">
                                        Pinjam Buku Ini
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}