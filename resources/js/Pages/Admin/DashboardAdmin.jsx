import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function DashboardAdmin({ auth, stats, recentLoans, loans, filters, flash, members, books, categories, staff, reviews }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState(null);

    const isLoansPage = url.startsWith('/admin/loans');
    const displayLoans = isLoansPage ? loans : recentLoans;

    useEffect(() => {
        if (flash?.success) { setToast({ type: 'success', message: flash.success }); setTimeout(() => setToast(null), 5000); }
        if (flash?.error) { setToast({ type: 'error', message: flash.error }); setTimeout(() => setToast(null), 5000); }
    }, [flash]);

    const handleAction = (action, id, label) => {
        setConfirmModal({ action, id, label });
    };

    const executeAction = () => {
        if (!confirmModal) return;
        router.patch(route(`admin.loans.${confirmModal.action}`, confirmModal.id), {}, { preserveScroll: true });
        setConfirmModal(null);
    };

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-blue-500/20 text-blue-400',
            dipinjam: 'bg-amber-500/20 text-amber-400',
            ditolak: 'bg-red-500/20 text-red-400',
            dikembalikan: 'bg-emerald-500/20 text-emerald-400',
            terlambat: 'bg-orange-500/20 text-orange-400',
            menunggu_pengembalian: 'bg-purple-500/20 text-purple-400',
        };
        return styles[status] || 'bg-white/10 text-white/60';
    };

    const statusLabel = (s) => ({ pending: 'Pending', dipinjam: 'Dipinjam', ditolak: 'Ditolak', dikembalikan: 'Dikembalikan', terlambat: 'Terlambat', menunggu_pengembalian: 'Menunggu Pengembalian' }[s] || s);

    // Filter loans by tab
    const pendingLoans = (displayLoans || []).filter(l => l.status === 'pending');
    const returnRequests = (displayLoans || []).filter(l => l.status === 'menunggu_pengembalian');
    const allLoans = displayLoans || [];

    return (
        <div className="min-h-screen bg-[#0f0f12] text-white flex overflow-hidden font-sans">
            <Head title="Admin Panel - Malaka Library" />

            {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-[#111] border-r border-white/10 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Malaka Library" className="w-10 h-10 object-contain" />
                        <div>
                            <div className="text-xs text-red-500 font-bold uppercase tracking-widest">Malaka Library</div>
                            <h2 className="text-lg font-bold font-serif">Admin Panel</h2>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-sm font-bold">{auth?.user?.name?.charAt(0) || 'A'}</div>
                        <div><p className="text-sm font-semibold">{auth?.user?.name || 'Admin'}</p><p className="text-[10px] text-red-400 uppercase tracking-wider">{auth?.role}</p></div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold px-4 pt-2 pb-1">Menu Utama</p>
                    {[
                        { key: 'overview', label: 'Dashboard', icon: '📊', roles: ['admin','petugas'] },
                        { key: 'loans', label: 'Peminjaman', icon: '📋', roles: ['admin','petugas'] },
                        { key: 'returns', label: 'Pengembalian', icon: '📦', roles: ['admin','petugas'] },
                        { key: 'books', label: 'Data Buku', icon: '📚', roles: ['admin','petugas'] },
                        { key: 'categories', label: 'Kategori', icon: '🏷️', roles: ['admin'] },
                        { key: 'members', label: 'Data Member', icon: '👥', roles: ['admin'] },
                        { key: 'staff', label: 'Petugas', icon: '👮', roles: ['admin'] },
                        { key: 'reviews', label: 'Ulasan', icon: '💬', roles: ['admin'] },
                        { key: 'reports', label: 'Laporan', icon: '🖨️', roles: ['admin','petugas'] },
                    ].filter(m => m.roles.includes(auth?.role)).map(m => (
                        <button key={m.key} onClick={() => { setActiveTab(m.key); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm w-full text-left transition-all ${activeTab === m.key ? 'bg-red-500/10 text-red-400 border border-red-500/15 font-semibold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                            <span className="text-base">{m.icon}</span> {m.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href={route('admin.logout')} method="post" as="button" className="flex items-center gap-3 w-full text-sm text-red-400 hover:text-red-300 transition-colors px-4 py-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden p-4">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-white/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                </div>

                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {/* Page Title */}
                    <h2 className="text-2xl font-bold font-serif mb-6">{
                        {overview:'Dashboard',loans:'Peminjaman',returns:'Pengembalian',books:'Data Buku',categories:'Kategori',members:'Data Member',staff:'Petugas',reviews:'Ulasan',reports:'Laporan'}[activeTab]
                    }</h2>

                    {/* Stats Cards — only on overview */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Total Buku', val: stats?.totalBooks, color: 'text-amber-400' },
                                { label: 'Peminjaman Aktif', val: stats?.activeLoans, color: 'text-blue-400' },
                                { label: 'Pending Pinjam', val: stats?.pendingLoans, color: 'text-purple-400' },
                                { label: 'Total Member', val: stats?.totalMembers, color: 'text-emerald-400' },
                                { label: 'Total Kategori', val: stats?.totalCategories, color: 'text-cyan-400' },
                                { label: 'Pending Kembali', val: stats?.pendingReturns, color: 'text-orange-400' },
                                { label: 'Total Ulasan', val: stats?.totalReviews, color: 'text-pink-400' },
                                { label: 'Total Pinjaman', val: stats?.totalLoans, color: 'text-indigo-400' },
                            ].map(s => (
                                <div key={s.label} className="bg-[#111]/80 border border-white/[0.06] rounded-2xl p-5">
                                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">{s.label}</p>
                                    <p className={`text-3xl font-bold ${s.color}`}>{s.val ?? 0}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB: Peminjaman */}
                    {activeTab === 'loans' && (
                        <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-lg font-bold font-serif">Peminjaman Terbaru</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['Buku', 'Peminjam', 'Kontak', 'Waktu', 'Status', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {allLoans.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-16 text-white/30">Belum ada data peminjaman.</td></tr>
                                        ) : allLoans.map(loan => (
                                            <tr key={loan.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3"><p className="text-sm font-semibold text-white">{loan.book_title}</p><p className="text-xs text-white/30">{loan.book_author}</p></td>
                                                <td className="px-5 py-3"><p className="text-sm text-white">{loan.user_name}</p><p className="text-xs text-white/30">{loan.user_email}</p></td>
                                                <td className="px-5 py-3"><p className="text-xs text-white/50">{loan.user_phone}</p><p className="text-xs text-white/30 max-w-[150px] truncate">{loan.user_address}</p></td>
                                                <td className="px-5 py-3"><p className="text-xs text-white/50">{loan.borrow_date}</p><p className="text-xs text-white/30">s/d {loan.due_date}</p></td>
                                                <td className="px-5 py-3"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge(loan.status)}`}>{statusLabel(loan.status)}</span></td>
                                                <td className="px-5 py-3">
                                                    {loan.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleAction('approve', loan.id, 'menyetujui peminjaman')} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all">Terima</button>
                                                            <button onClick={() => handleAction('reject', loan.id, 'menolak peminjaman')} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">Tolak</button>
                                                        </div>
                                                    )}
                                                    {loan.status !== 'pending' && <span className="text-white/20 text-xs">—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: Pengembalian */}
                    {activeTab === 'returns' && (
                        <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-lg font-bold font-serif">Pengajuan Pengembalian</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['Buku', 'Peminjam', 'Tgl Pinjam', 'Tenggat', 'Status', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {returnRequests.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-16 text-white/30">Belum ada pengajuan pengembalian.</td></tr>
                                        ) : returnRequests.map(loan => (
                                            <tr key={loan.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3"><p className="text-sm font-semibold text-white">{loan.book_title}</p><p className="text-xs text-white/30">{loan.book_author}</p></td>
                                                <td className="px-5 py-3"><p className="text-sm text-white">{loan.user_name}</p><p className="text-xs text-white/30">{loan.user_email}</p></td>
                                                <td className="px-5 py-3 text-xs text-white/50">{loan.borrow_date}</td>
                                                <td className="px-5 py-3 text-xs text-white/50">{loan.due_date}</td>
                                                <td className="px-5 py-3"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge(loan.status)}`}>{statusLabel(loan.status)}</span></td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAction('approveReturn', loan.id, 'menyetujui pengembalian')} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-white transition-all">Terima</button>
                                                        <button onClick={() => handleAction('rejectReturn', loan.id, 'menolak pengembalian')} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">Tolak</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: Members */}
                    {activeTab === 'members' && (
                        <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-lg font-bold font-serif">Daftar Member</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['Nama', 'Email', 'No. Telp', 'Alamat', 'Terdaftar', 'Pinjam', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(members || []).length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-16 text-white/30">Belum ada member terdaftar.</td></tr>
                                        ) : (members || []).map(m => (
                                            <tr key={m.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3 text-sm font-semibold text-white">{m.name}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{m.email}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{m.phone}</td>
                                                <td className="px-5 py-3 text-sm text-white/40 max-w-[200px] truncate">{m.address}</td>
                                                <td className="px-5 py-3 text-sm text-white/40">{m.created_at}</td>
                                                <td className="px-5 py-3 text-center"><span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">{m.total_loans}</span></td>
                                                <td className="px-5 py-3"><button onClick={() => { if(confirm('Hapus member ini?')) router.delete(route('admin.users.destroy', m.id)) }} className="text-xs text-red-400 hover:text-red-300">Hapus</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* TAB: Books */}
                    {activeTab === 'books' && (
                        <div className="space-y-6">
                            {/* Create Book Form */}
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                    <span className="text-lg">📚</span>
                                    <div><h3 className="text-base font-bold">Tambah Buku Baru</h3><p className="text-[11px] text-white/30">Isi data buku untuk ditambahkan ke katalog</p></div>
                                </div>
                                <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); router.post(route('admin.books.store'), fd, { forceFormData: true, preserveScroll: true, onSuccess: () => e.target.reset() }); }} className="p-6 space-y-5">
                                    {/* Row 1: Judul */}
                                    <div>
                                        <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Judul Buku <span className="text-red-400">*</span></label>
                                        <input name="title" placeholder="Masukkan judul buku" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                    </div>
                                    {/* Row 2: Penulis + Penerbit */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Penulis <span className="text-red-400">*</span></label>
                                            <input name="author" placeholder="Nama penulis" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Penerbit</label>
                                            <input name="publisher" placeholder="Nama penerbit (opsional)" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                    </div>
                                    {/* Row 3: ISBN + Tahun + Stok */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">ISBN</label>
                                            <input name="isbn" placeholder="978-xxx" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Tahun Terbit</label>
                                            <input name="year" type="number" placeholder="2024" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Jumlah Stok <span className="text-red-400">*</span></label>
                                            <input name="stock" type="number" min="1" defaultValue="1" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                    </div>
                                    {/* Row 4: Sinopsis */}
                                    <div>
                                        <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Sinopsis / Deskripsi</label>
                                        <textarea name="description" placeholder="Tulis sinopsis atau deskripsi singkat buku..." rows={3} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all resize-none" />
                                    </div>
                                    {/* Row 5: Kategori + Cover */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Kategori <span className="text-white/20">(Ctrl+Click untuk pilih banyak)</span></label>
                                            <select name="category_ids[]" multiple className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500/40 h-24">
                                                {(categories || []).map(c => <option key={c.id} value={c.id} className="bg-[#1a1a1a] py-1">{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Sampul Buku</label>
                                            <div className="border border-dashed border-white/[0.08] rounded-xl p-4 hover:border-amber-500/30 transition-colors">
                                                <input name="cover" type="file" accept="image/*" className="w-full text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500/10 file:text-red-400 file:text-xs file:font-bold hover:file:bg-red-500/20 file:cursor-pointer" />
                                                <p className="text-[10px] text-white/20 mt-2">Format: JPG, PNG, WEBP — Maks 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Submit */}
                                    <div className="pt-2 border-t border-white/[0.04]">
                                        <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-red-700 to-amber-700 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-amber-600 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">📚 Tambah Buku</button>
                                    </div>
                                </form>
                            </div>
                            {/* Books Table */}
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
                                    <h3 className="text-base font-bold font-serif">Daftar Buku ({(books||[]).length})</h3>
                                </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['Judul', 'Penulis', 'Kategori', 'Stok', 'Status', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(books || []).map(b => (
                                            <tr key={b.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3 text-sm font-semibold text-white">{b.title}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{b.author}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{b.categories}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{b.available} / {b.stock}</td>
                                                <td className="px-5 py-3"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${b.is_approved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{b.is_approved ? 'Approved' : 'Pending'}</span></td>
                                                <td className="px-5 py-3 flex gap-2">
                                                    {!b.is_approved && auth?.role === 'admin' && (
                                                        <button onClick={() => { if(confirm('Approve buku ini?')) router.patch(route('admin.books.approve', b.id)) }} className="text-xs text-emerald-400 hover:text-emerald-300">✓ Approve</button>
                                                    )}
                                                    <button onClick={() => { if(confirm('Hapus buku ini?')) router.delete(route('admin.books.destroy', b.id)) }} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* TAB: Categories (Admin Only) */}
                    {activeTab === 'categories' && auth?.role === 'admin' && (
                        <div className="space-y-6">
                            {/* Create Category Form */}
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl p-6">
                                <h3 className="text-base font-bold mb-4">➕ Tambah Kategori Baru</h3>
                                <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); router.post(route('admin.categories.store'), Object.fromEntries(fd), { preserveScroll: true, onSuccess: () => e.target.reset() }); }} className="flex gap-4">
                                    <input name="name" placeholder="Nama Kategori *" required className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-red-500/40" />
                                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-red-700 to-amber-700 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-amber-600 transition-all">Tambah</button>
                                </form>
                            </div>
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-base font-bold font-serif">Daftar Kategori ({(categories||[]).length})</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['Nama', 'Jumlah Buku', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(categories || []).map(c => (
                                            <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3 text-sm font-semibold text-white">{c.name}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{c.books_count}</td>
                                                <td className="px-5 py-3"><button onClick={() => { if(confirm('Hapus kategori ini?')) router.delete(route('admin.categories.destroy', c.id)) }} className="text-xs text-red-400 hover:text-red-300">Hapus</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    )}

                    {activeTab === 'staff' && auth?.role === 'admin' && (
                        <div className="space-y-6">
                            {/* Create Staff Form */}
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                    <span className="text-lg">👮</span>
                                    <div><h3 className="text-base font-bold">Tambah Petugas Baru</h3><p className="text-[11px] text-white/30">Daftarkan akun petugas untuk kelola perpustakaan</p></div>
                                </div>
                                <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); router.post(route('admin.staff.store'), Object.fromEntries(fd), { preserveScroll: true, onSuccess: () => e.target.reset() }); }} className="p-6 space-y-5">
                                    {/* Row 1: Nama */}
                                    <div>
                                        <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Nama Petugas <span className="text-red-400">*</span></label>
                                        <input name="name" placeholder="Nama lengkap petugas" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                    </div>
                                    {/* Row 2: Email + Password */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Email <span className="text-red-400">*</span></label>
                                            <input name="email" type="email" placeholder="email@contoh.com" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">Password <span className="text-red-400">*</span></label>
                                            <input name="password" type="password" placeholder="Minimal 6 karakter" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                        </div>
                                    </div>
                                    {/* Row 3: No. Telp */}
                                    <div className="md:w-1/2">
                                        <label className="block text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1.5">No. Telepon</label>
                                        <input name="phone" placeholder="08xxxxxxxxxx (opsional)" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 transition-all" />
                                    </div>
                                    {/* Submit */}
                                    <div className="pt-2 border-t border-white/[0.04]">
                                        <button type="submit" className="px-8 py-2.5 bg-gradient-to-r from-red-700 to-amber-700 text-white text-sm font-bold rounded-xl hover:from-red-600 hover:to-amber-600 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]">👮 Tambah Petugas</button>
                                    </div>
                                </form>
                            </div>
                            <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-base font-bold font-serif">Daftar Petugas ({(staff||[]).length})</h3></div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead><tr className="border-b border-white/[0.05]">
                                            {['Nama', 'Email', 'No. Telp', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                        </tr></thead>
                                        <tbody>
                                            {(staff || []).map(s => (
                                                <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                    <td className="px-5 py-3 text-sm font-semibold text-white">{s.name}</td>
                                                    <td className="px-5 py-3 text-sm text-white/50">{s.email}</td>
                                                    <td className="px-5 py-3 text-sm text-white/50">{s.phone}</td>
                                                    <td className="px-5 py-3"><button onClick={() => { if(confirm('Hapus petugas ini?')) router.delete(route('admin.staff.destroy', s.id)) }} className="text-xs text-red-400 hover:text-red-300">Hapus</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: Reviews */}
                    {activeTab === 'reviews' && auth?.role === 'admin' && (
                        <div className="bg-[#111]/80 border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-white/[0.06]"><h3 className="text-lg font-bold font-serif">Data Ulasan</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="border-b border-white/[0.05]">
                                        {['User', 'Buku', 'Rating', 'Komentar', 'Tanggal', 'Aksi'].map(h => <th key={h} className="text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest px-5 py-3">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {(reviews || []).map(r => (
                                            <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                                <td className="px-5 py-3 text-sm font-semibold text-white">{r.user_name}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{r.book_title}</td>
                                                <td className="px-5 py-3 text-sm text-emerald-400">{'⭐'.repeat(r.rating)}</td>
                                                <td className="px-5 py-3 text-sm text-white/50 max-w-[200px] truncate">{r.comment}</td>
                                                <td className="px-5 py-3 text-sm text-white/50">{r.created_at}</td>
                                                <td className="px-5 py-3"><button onClick={() => { if(confirm('Hapus ulasan ini?')) router.delete(route('admin.reviews.destroy', r.id)) }} className="text-xs text-red-400 hover:text-red-300">Hapus</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: Reports — Printable */}
                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { key:'books', label:'Laporan Buku', desc:'Data lengkap buku perpustakaan', roles:['admin','petugas'] },
                                    { key:'loans_report', label:'Laporan Peminjaman', desc:'Riwayat peminjaman & pengembalian', roles:['admin','petugas'] },
                                    { key:'members_report', label:'Laporan Member', desc:'Data anggota perpustakaan', roles:['admin'] },
                                    { key:'staff_report', label:'Laporan Petugas', desc:'Data petugas perpustakaan', roles:['admin'] },
                                ].filter(r => r.roles.includes(auth?.role)).map(r => (
                                    <div key={r.key} className="bg-[#111]/80 border border-white/[0.06] rounded-2xl p-6">
                                        <h3 className="text-base font-bold font-serif mb-1">{r.label}</h3>
                                        <p className="text-sm text-white/40 mb-4">{r.desc}</p>
                                        <button onClick={() => { setReportType(r.key); setShowReport(true); }} className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-amber-600 transition-all">🖨️ Cetak Laporan</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* CONFIRM MODAL */}
            {confirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
                    <div className="relative bg-[#151515] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Konfirmasi</h3>
                        <p className="text-white/50 text-sm mb-6">Yakin mau {confirmModal.label}?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Batal</button>
                            <button onClick={executeAction} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 shadow-lg transition-all">Ya, Lanjutkan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[9999] max-w-sm px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300' : 'bg-red-900/90 border-red-500/30 text-red-300'}`}>
                    <div className="flex items-start gap-3">
                        <p className="text-sm font-medium">{toast.message}</p>
                        <button onClick={() => setToast(null)} className="ml-auto text-white/40 hover:text-white">✕</button>
                    </div>
                </div>
            )}

            {/* PRINT REPORT MODAL */}
            {showReport && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowReport(false)} />
                    <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10 no-print">
                            <h3 className="text-lg font-bold text-gray-800">Preview Laporan</h3>
                            <div className="flex gap-3">
                                <button onClick={() => { const el = document.getElementById('report-content'); const w = window.open('','','width=800,height=600'); w.document.write('<html><head><title>Laporan Malaka Library</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#222}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #ddd;padding:8px 12px;text-align:left;font-size:13px}th{background:#f5f5f5;font-weight:600}h2{margin:0}p{color:#666;margin:4px 0 0}.header{text-align:center;margin-bottom:24px;border-bottom:2px solid #c00;padding-bottom:16px}@media print{body{padding:10px}}</style></head><body>'+el.innerHTML+'</body></html>'); w.document.close(); w.print(); }} className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-500">🖨️ Cetak</button>
                                <button onClick={() => setShowReport(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200">Tutup</button>
                            </div>
                        </div>
                        <div id="report-content" className="p-8 text-gray-800">
                            <div className="text-center mb-6 border-b-2 border-red-600 pb-4">
                                <h2 className="text-xl font-bold">PERPUSTAKAAN MALAKA LIBRARY</h2>
                                <p className="text-sm text-gray-500">Laporan dicetak pada: {new Date().toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})}</p>
                            </div>
                            {reportType === 'books' && (<>
                                <h3 className="text-lg font-bold mb-1">Laporan Data Buku</h3>
                                <p className="text-sm text-gray-500 mb-4">Total: {(books||[]).length} buku</p>
                                <table><thead><tr><th>No</th><th>Judul</th><th>Penulis</th><th>Penerbit</th><th>Kategori</th><th>Stok</th><th>Tersedia</th><th>Status</th></tr></thead><tbody>
                                    {(books||[]).map((b,i) => <tr key={b.id}><td>{i+1}</td><td>{b.title}</td><td>{b.author}</td><td>{b.publisher||'-'}</td><td>{b.categories||'-'}</td><td>{b.stock}</td><td>{b.available}</td><td>{b.is_approved?'Approved':'Pending'}</td></tr>)}
                                </tbody></table>
                            </>)}
                            {reportType === 'loans_report' && (<>
                                <h3 className="text-lg font-bold mb-1">Laporan Peminjaman</h3>
                                <p className="text-sm text-gray-500 mb-4">Total: {allLoans.length} transaksi</p>
                                <table><thead><tr><th>No</th><th>Buku</th><th>Peminjam</th><th>Tgl Pinjam</th><th>Tenggat</th><th>Status</th></tr></thead><tbody>
                                    {allLoans.map((l,i) => <tr key={l.id}><td>{i+1}</td><td>{l.book_title}</td><td>{l.user_name}</td><td>{l.borrow_date}</td><td>{l.due_date}</td><td>{statusLabel(l.status)}</td></tr>)}
                                </tbody></table>
                            </>)}
                            {reportType === 'members_report' && (<>
                                <h3 className="text-lg font-bold mb-1">Laporan Data Member</h3>
                                <p className="text-sm text-gray-500 mb-4">Total: {(members||[]).length} anggota</p>
                                <table><thead><tr><th>No</th><th>Nama</th><th>Email</th><th>No. Telp</th><th>Alamat</th><th>Terdaftar</th><th>Total Pinjam</th></tr></thead><tbody>
                                    {(members||[]).map((m,i) => <tr key={m.id}><td>{i+1}</td><td>{m.name}</td><td>{m.email}</td><td>{m.phone}</td><td>{m.address}</td><td>{m.created_at}</td><td>{m.total_loans}</td></tr>)}
                                </tbody></table>
                            </>)}
                            {reportType === 'staff_report' && (<>
                                <h3 className="text-lg font-bold mb-1">Laporan Data Petugas</h3>
                                <p className="text-sm text-gray-500 mb-4">Total: {(staff||[]).length} petugas</p>
                                <table><thead><tr><th>No</th><th>Nama</th><th>Email</th><th>No. Telp</th></tr></thead><tbody>
                                    {(staff||[]).map((s,i) => <tr key={s.id}><td>{i+1}</td><td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td></tr>)}
                                </tbody></table>
                            </>)}

                            {/* ═══ TANDA TANGAN ═══ */}
                            <div style={{marginTop:'48px', pageBreakInside:'avoid'}}>
                                <div style={{display:'flex', justifyContent:'space-between', marginTop:'24px'}}>
                                    <div style={{textAlign:'center', width:'45%'}}>
                                        <p style={{margin:'0', fontSize:'13px', fontWeight:'600'}}>Mengetahui,</p>
                                        <p style={{margin:'2px 0 0', fontSize:'12px', color:'#666'}}>Kepala Perpustakaan</p>
                                        <div style={{height:'80px'}} />
                                        <p style={{margin:'0', fontSize:'13px', fontWeight:'600', borderTop:'1px solid #333', display:'inline-block', paddingTop:'4px', minWidth:'180px'}}>(...............................)</p>
                                        <p style={{margin:'2px 0 0', fontSize:'11px', color:'#888'}}>NIP. ___________________</p>
                                    </div>
                                    <div style={{textAlign:'center', width:'45%'}}>
                                        <p style={{margin:'0', fontSize:'13px', fontWeight:'600'}}>Yang Membuat Laporan,</p>
                                        <p style={{margin:'2px 0 0', fontSize:'12px', color:'#666'}}>{auth?.role === 'admin' ? 'Admin' : 'Petugas'} Perpustakaan</p>
                                        <div style={{height:'80px'}} />
                                        <p style={{margin:'0', fontSize:'13px', fontWeight:'600', borderTop:'1px solid #333', display:'inline-block', paddingTop:'4px', minWidth:'180px'}}>{auth?.user?.name || '(...............................)'}</p>
                                        <p style={{margin:'2px 0 0', fontSize:'11px', color:'#888'}}>NIP. ___________________</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
