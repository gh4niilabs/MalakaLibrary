import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Riwayat({ auth, borrowHistory = [], flash }) {
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [returnModal, setReturnModal] = useState(null);
    const [receiptModal, setReceiptModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [reviewModal, setReviewModal] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => { setMounted(true); const h = () => setScrollY(window.scrollY); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);

    useEffect(() => {
        if (flash?.success) { setToast({ type: 'success', message: flash.success }); setTimeout(() => setToast(null), 5000); }
        if (flash?.error) { setToast({ type: 'error', message: flash.error }); setTimeout(() => setToast(null), 5000); }
    }, [flash]);

    const navLinks = [
        { label: 'Home', href: '/', active: route().current('home') },
        { label: 'About', href: '/about', active: route().current('about') },
        { label: 'Katalog Buku', href: '/katalog', active: route().current('katalog.index') },
        { label: 'Favorit', href: '/favorit', active: route().current('favorit') },
        { label: 'Riwayat', href: '/riwayat', active: route().current('riwayat') },
    ];

    const statusFilters = [
        { key: 'all', label: 'Semua', color: 'white' },
        { key: 'pending', label: 'Pending', color: 'blue' },
        { key: 'dipinjam', label: 'Dipinjam', color: 'amber' },
        { key: 'menunggu_pengembalian', label: 'Menunggu Return', color: 'purple' },
        { key: 'dikembalikan', label: 'Dikembalikan', color: 'emerald' },
        { key: 'ditolak', label: 'Ditolak', color: 'gray' },
    ];

    const statusConfig = {
        pending:      { bg: 'bg-blue-500/10', border: 'border-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Pending' },
        dipinjam:     { bg: 'bg-amber-500/10', border: 'border-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Dipinjam' },
        menunggu_pengembalian: { bg: 'bg-purple-500/10', border: 'border-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', label: 'Menunggu Pengembalian' },
        dikembalikan: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Dikembalikan' },
        terlambat:    { bg: 'bg-red-500/10', border: 'border-red-500/15', text: 'text-red-400', dot: 'bg-red-400', label: 'Terlambat' },
        ditolak:      { bg: 'bg-gray-500/10', border: 'border-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400', label: 'Ditolak' },
    };

    const filteredHistory = borrowHistory.filter(item => {
        const matchStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
    });

    const submitReturn = (id) => {
        setProcessing(true);
        router.patch(route('loans.requestReturn', id), {}, {
            preserveScroll: true,
            onSuccess: () => setReturnModal(null),
            onFinish: () => setProcessing(false),
        });
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

    return (
        <>
            <Head title="Riwayat Peminjaman — Malaka Library">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    body { font-family: 'Inter', sans-serif; margin: 0; background: #0f0f12; }
                    .font-display { font-family: 'Playfair Display', serif; }
                    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
            </Head>

            <div className="min-h-screen bg-[#0f0f12] text-white selection:bg-amber-500/30">
                {/* Navbar */}
                <header className={`sticky top-0 z-50 transition-all duration-500 ${scrollY > 20 ? 'bg-[#0f0f12]/90 backdrop-blur-2xl shadow-xl border-b border-white/[0.04]' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-[68px]">
                            <Link href="/" className="flex items-center gap-3 group">
                                <img src="/logo.png" alt="Malaka Library" className="w-9 h-9 rounded-xl object-contain shadow-lg" />
                                <span className="font-display text-[17px] text-white hidden sm:block">Malaka <span className="text-amber-400">Library</span></span>
                            </Link>
                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => (
                                    <Link key={link.label} href={link.href} className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${link.active ? 'text-amber-400 bg-amber-500/[0.08]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'}`}>{link.label}</Link>
                                ))}
                            </nav>
                            <div className="flex items-center gap-2.5">
                                {auth?.user ? (
                                    <Link href={route('profile.edit')} className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-[11px] font-bold uppercase ring-2 ring-white/5">{auth.user.name?.charAt(0)}</div>
                                        <span className="hidden sm:block text-[13px] font-medium">{auth.user.name}</span>
                                    </Link>
                                ) : (
                                    <><Link href={route('login')} className="text-[13px] text-white/50 hover:text-white px-4 py-2">Masuk</Link><Link href={route('register')} className="text-[13px] bg-red-700 text-white font-semibold px-5 py-2 rounded-xl">Daftar</Link></>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative py-16 sm:py-20 overflow-hidden">
                    <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-amber-700/[0.05] rounded-full blur-[120px]" />
                    <div className="relative max-w-6xl mx-auto px-5">
                        <div className={`transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0 translate-y-6'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/[0.07] border border-amber-500/10 text-amber-400 text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Riwayat Peminjaman
                            </div>
                            <h1 className="font-display text-3xl sm:text-5xl text-white mb-4">Riwayat <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">Peminjaman</span></h1>
                            <p className="text-white/30 text-sm max-w-lg">Pantau semua buku yang pernah kamu pinjam. Lihat status dan ajukan pengembalian.</p>
                        </div>

                        {/* Filters */}
                        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="inline-flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.05] flex-wrap gap-0.5">
                                {statusFilters.map(({ key, label, color }) => (
                                    <button key={key} onClick={() => setFilterStatus(key)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filterStatus === key ? (color === 'amber' ? 'bg-amber-600/80 text-white' : color === 'emerald' ? 'bg-emerald-600/80 text-white' : color === 'purple' ? 'bg-purple-600/80 text-white' : color === 'red' ? 'bg-red-600/80 text-white' : color === 'blue' ? 'bg-blue-600/80 text-white' : color === 'gray' ? 'bg-gray-600/80 text-white' : 'bg-white/10 text-white') : 'text-white/30 hover:text-white/60'}`}>{label}</button>
                                ))}
                            </div>
                            <div className="relative w-full sm:max-w-xs">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari judul buku..." className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-amber-500/30 transition-all" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="relative pb-24">
                    <div className="max-w-6xl mx-auto px-5">
                        {filteredHistory.length === 0 ? (
                            <div className="bg-[#111]/80 border border-white/[0.04] rounded-3xl overflow-hidden">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                                <div className="py-20 flex flex-col items-center text-center px-6">
                                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-900/25 to-red-900/15 border border-amber-500/[0.08] flex items-center justify-center mb-8">
                                        <svg className="w-14 h-14 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="font-display text-2xl text-white mb-3">{borrowHistory.length === 0 ? <>Belum Ada <span className="text-amber-400">Riwayat</span></> : <>Tidak Ada <span className="text-amber-400">Hasil</span></>}</h3>
                                    <p className="text-white/30 text-sm max-w-md mb-8">{borrowHistory.length === 0 ? 'Kamu belum pernah meminjam buku.' : 'Coba ubah filter atau kata kunci.'}</p>
                                    {borrowHistory.length === 0 && <Link href={route('katalog.index')} className="px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-700 to-red-700 shadow-lg hover:scale-[1.02] transition-all">Jelajahi Katalog</Link>}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#111]/80 border border-white/[0.04] rounded-3xl overflow-hidden">
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/[0.05]">
                                                <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Buku</th>
                                                <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Tgl Pinjam</th>
                                                <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Tenggat</th>
                                                <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Status</th>
                                                <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Denda</th>
                                                <th className="text-center text-[11px] font-semibold text-white/30 uppercase tracking-widest px-6 py-4">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistory.map((item, i) => {
                                                const sc = statusConfig[item.status] || statusConfig.pending;
                                                return (
                                                    <tr key={item.id || i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-red-900/30 to-amber-900/20 border border-white/[0.05] flex items-center justify-center flex-shrink-0">
                                                                    {item.cover ? <img src={item.cover} className="w-full h-full object-cover rounded-lg" /> : <svg className="w-5 h-5 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">{item.title}</p>
                                                                    <p className="text-xs text-white/30 mt-0.5">{item.author}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-white/40">{item.borrowed_at}</td>
                                                        <td className="px-6 py-4 text-sm text-white/40">{item.due_date}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${sc.bg} border ${sc.border} ${sc.text}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item.fine ? (
                                                                <div>
                                                                    <p className="text-sm font-bold text-red-400">Rp {item.fine.total.toLocaleString('id-ID')}</p>
                                                                    <p className="text-[10px] text-red-400/60">{item.fine.days_late} hari terlambat</p>
                                                                    <span className={`text-[10px] font-semibold ${item.fine.status === 'paid' ? 'text-emerald-400' : 'text-red-400'}`}>{item.fine.status === 'paid' ? '✓ Lunas' : '✗ Belum Bayar'}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-emerald-400/40">Tidak ada</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                            {item.status === 'dipinjam' && (
                                                                <button onClick={() => setReturnModal(item)} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all">Kembalikan</button>
                                                            )}
                                                            {item.status === 'menunggu_pengembalian' && (
                                                                <span className="text-xs text-purple-400/60 italic">Menunggu admin...</span>
                                                            )}
                                                            {item.status === 'dikembalikan' && !item.review && (
                                                                <button onClick={() => { setReviewModal(item); setReviewRating(5); setReviewComment(''); }} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500 hover:text-black transition-all">⭐ Ulasan</button>
                                                            )}
                                                            {item.status === 'dikembalikan' && item.review && (
                                                                <span className="text-xs text-emerald-400/60">{'⭐'.repeat(item.review.rating)}</span>
                                                            )}
                                                            {(item.status === 'dikembalikan' || item.status === 'dipinjam') && (
                                                                <button onClick={() => setReceiptModal(item)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-xs font-medium rounded-lg hover:bg-white/10 hover:text-white transition-all">🖨 Cetak</button>
                                                            )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="border-t border-white/[0.04] py-10 px-5 bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="ML" className="w-6 h-6 rounded-md object-contain" />
                            <span className="font-display text-sm text-white/60">Perpustakaan <span className="text-amber-400/70">Digital</span></span>
                        </div>
                        <p className="text-white/20 text-xs">SMK RPL &copy; {new Date().getFullYear()}</p>
                    </div>
                </footer>

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-6 right-6 z-[9999] max-w-sm px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-[fadeUp_0.4s] ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300' : 'bg-red-900/90 border-red-500/30 text-red-300'}`}>
                        <div className="flex items-start gap-3">
                            <p className="text-sm font-medium">{toast.message}</p>
                            <button onClick={() => setToast(null)} className="ml-auto text-white/40 hover:text-white">✕</button>
                        </div>
                    </div>
                )}

                {/* RETURN MODAL */}
                {returnModal && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReturnModal(null)} />
                        <div className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[fadeUp_0.3s]">
                            <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />
                            <div className="p-6">
                                <h3 className="font-display text-xl text-white mb-1">Ajukan Pengembalian</h3>
                                <p className="text-white/40 text-xs mb-6">Detail buku yang akan dikembalikan</p>
                                <div className="space-y-3 mb-6">
                                    {[['Judul', returnModal.title], ['Penulis', returnModal.author], ['Penerbit', returnModal.publisher], ['Tgl Pinjam', returnModal.borrowed_at], ['Tgl Kembali', returnModal.due_date]].map(([l, v]) => (
                                        <div key={l} className="flex justify-between py-2 border-b border-white/5"><span className="text-white/40 text-sm">{l}</span><span className="text-white text-sm font-medium">{v}</span></div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setReturnModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Batal</button>
                                    <button onClick={() => submitReturn(returnModal.id)} disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 shadow-lg transition-all disabled:opacity-50">
                                        {processing ? 'Memproses...' : '📦 Ajukan Pengembalian'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RECEIPT MODAL */}
                {receiptModal && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReceiptModal(null)} />
                        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[fadeUp_0.3s]">
                            <div className={`p-6 text-center ${receiptModal.status === 'dikembalikan' ? 'bg-gradient-to-r from-emerald-700 to-emerald-800' : 'bg-gradient-to-r from-red-700 to-red-800'}`}>
                                <h3 className="text-white font-bold text-lg">Bukti {receiptModal.status === 'dikembalikan' ? 'Pengembalian' : 'Peminjaman'}</h3>
                                <p className="text-white/60 text-xs mt-1">Malaka Library</p>
                            </div>
                            <div className="p-6 space-y-3 text-sm">
                                {[['Nama', receiptModal.user_name || auth?.user?.name], ['Judul Buku', receiptModal.title], ['Penulis', receiptModal.author], ['Penerbit', receiptModal.publisher], ['Tgl Pinjam', receiptModal.borrowed_at], ['Tgl Kembali', receiptModal.due_date], ['Status', receiptModal.status === 'dikembalikan' ? 'Dikembalikan' : 'Dipinjam']].map(([l, v]) => (
                                    <div key={l} className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">{l}</span><span className="font-semibold text-gray-800 text-right max-w-[200px]">{v}</span></div>
                                ))}
                            </div>
                            <div className="px-6 pb-6 flex gap-3">
                                <button onClick={() => setReceiptModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">Tutup</button>
                                <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg transition-all">🖨️ Cetak</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* REVIEW MODAL */}
                {reviewModal && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
                        <div className="relative w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[fadeUp_0.3s]">
                            <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
                            <div className="p-6">
                                <h3 className="font-display text-xl text-white mb-1">Tulis Ulasan</h3>
                                <p className="text-white/40 text-xs mb-4">Bagikan pengalamanmu membaca "{reviewModal.title}"</p>
                                <div className="mb-4">
                                    <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button key={star} onClick={() => setReviewRating(star)} className={`text-2xl transition-all ${star <= reviewRating ? 'text-amber-400 scale-110' : 'text-white/20 hover:text-white/40'}`}>⭐</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">Komentar</label>
                                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3} placeholder="Tulis komentar kamu..." className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/40 transition-all resize-none placeholder-white/20" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Batal</button>
                                    <button onClick={() => { setProcessing(true); router.post(route('reviews.store'), { loan_id: reviewModal.id, rating: reviewRating, comment: reviewComment }, { preserveScroll: true, onSuccess: () => setReviewModal(null), onFinish: () => setProcessing(false) }); }} disabled={processing} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-600 hover:to-yellow-600 shadow-lg transition-all disabled:opacity-50">
                                        {processing ? 'Mengirim...' : '⭐ Kirim Ulasan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
