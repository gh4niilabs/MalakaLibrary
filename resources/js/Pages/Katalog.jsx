import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import LibraryLayout from '@/Layouts/LibraryLayout';

export default function Katalog({ auth, books = [], categories = [], filters = {}, flash }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedBook, setSelectedBook] = useState(null);
    const [dueDate, setDueDate] = useState('');

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('katalog.index'), { search, category: filters.category ?? 'all' }, { preserveState: true });
    };

    const borrow = (book) => {
        if (!auth?.user) return router.visit(route('login'));
        const date = new Date();
        date.setDate(date.getDate() + 7);
        setDueDate(date.toISOString().slice(0, 10));
        setSelectedBook(book);
    };

    const confirmBorrow = () => {
        if (!selectedBook || !dueDate) return;
        router.post(route('loans.store'), { book_id: selectedBook.id, due_date: dueDate }, { preserveScroll: true, onSuccess: () => setSelectedBook(null) });
    };

    return (
        <LibraryLayout auth={auth} title="Katalog Buku">
            <Head><meta name="description" content="Katalog buku Malaka Library." /></Head>
            <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6">
                <section className="border-b border-[#2A2A2A] pb-6">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-meta-sm text-meta-sm uppercase tracking-widest text-[#737373]">Katalog Utama Perpustakaan</p><h1 className="mt-3 font-display text-headline-lg text-white md:text-display">Katalog Buku &amp; Literatur Sekolah</h1><p className="mt-2 max-w-2xl font-body-md text-body-md text-[#A3A3A3]">Akses judul buku pelajaran, sastra klasik, sains, dan ensiklopedia terbitan resmi untuk civitas akademika Perpustakaan Sekolah Malaka.</p></div><div className="flex gap-8 font-meta-sm text-meta-sm text-[#737373]"><div><strong className="block text-white">{books.length}</strong>Judul Terdata</div><div><strong className="block text-white">98,2%</strong>Ketersediaan Rak</div></div></div>
                </section>

                <form onSubmit={submitSearch} className="mt-6 flex items-center border-b border-[#2A2A2A] py-3"><span className="mr-4 text-[#A3A3A3]" aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, pengarang, ISBN, atau topik pelajaran..." className="w-full bg-transparent font-body-md text-body-md text-white outline-none placeholder:text-[#737373]" /></form>
                <div className="flex gap-6 overflow-x-auto border-b border-[#2A2A2A] py-4 font-body-md text-body-md whitespace-nowrap"><Link href={route('katalog.index', { search })} className={`border-b-2 pb-3 ${!filters.category || filters.category === 'all' ? 'border-[#FACC15] text-white' : 'border-transparent text-[#A3A3A3]'}`}>Semua Koleksi</Link>{categories.map((category) => <Link key={category.id} href={route('katalog.index', { category: category.slug, search })} className={`border-b-2 pb-3 ${filters.category === category.slug ? 'border-[#FACC15] text-white' : 'border-transparent text-[#A3A3A3]'}`}>{category.name}</Link>)}<span className="ml-auto hidden text-meta-sm text-[#737373] md:block">Menampilkan {books.length} koleksi aktif</span></div>

                {flash?.success && <p className="mt-5 border border-[#2A2A2A] bg-[#1A1A1A] p-3 text-body-md text-[#FACC15]">{flash.success}</p>}
                <section className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
                    {books.map((book) => <article key={book.id} className="rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-3.5"><div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#242424]"><div className="flex h-full items-center justify-center px-6 text-center font-headline-sm text-headline-sm text-white">{book.cover ? <img src={book.cover} alt={book.title} className="h-full w-full object-cover" /> : book.title}</div><span className="absolute left-2 top-2 border border-[#2A2A2A] bg-[#0F0F0F] px-1.5 py-0.5 font-meta-sm text-[10px] uppercase text-[#FACC15]">{book.categories?.[0]?.name ?? 'Koleksi'}</span></div><div className="mt-3 flex items-center justify-between font-meta-sm text-meta-sm"><span className="text-[#737373]">DDC {book.isbn ?? '—'}</span><span className="text-[#737373]">{book.publisher ?? 'Malaka'}</span></div><p className="mt-3 font-meta-sm text-meta-sm uppercase text-[#FACC15]">{book.available > 0 ? 'Koleksi tersedia' : 'Tidak tersedia'} <span className="float-right text-white">★ 4.9</span></p><h2 className="mt-2 line-clamp-2 font-headline-sm text-headline-sm text-white">{book.title}</h2><p className="mt-1 line-clamp-1 font-body-md text-body-md text-[#A3A3A3]">{book.author}</p><p className="mt-3 border-b border-[#2A2A2A] pb-3 font-meta-sm text-meta-sm text-[#737373]">Tersedia: {book.available ?? 0} Eks.</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => borrow(book)} disabled={!book.available} className="flex-1 rounded-md bg-[#DC2626] px-3 py-2 font-label-md text-label-md font-medium text-white hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-40">Pinjam Buku</button><button type="button" onClick={() => auth?.user && router.post(route('favorites.toggle', book.id), {}, { preserveScroll: true })} className={`w-10 border border-[#2A2A2A] font-body-md ${book.is_favorited ? 'text-[#FACC15]' : 'text-[#A3A3A3]'}`} aria-label="Simpan favorit">☆</button></div></article>)}
                </section>

                <section className="grid border border-[#2A2A2A] bg-[#1A1A1A] md:grid-cols-3"><div className="border-b border-[#2A2A2A] p-5 md:border-b-0 md:border-r"><p className="font-meta-sm text-meta-sm uppercase text-[#737373]">Sirkulasi Aktif</p><strong className="mt-2 block font-title-md text-title-md text-white">342 Buku Sedang Dipinjam</strong><span className="font-meta-sm text-meta-sm text-[#737373]">Tingkat pengembalian tepat waktu: 96,4%</span></div><div className="border-b border-[#2A2A2A] p-5 md:border-b-0 md:border-r"><p className="font-meta-sm text-meta-sm uppercase text-[#737373]">Batas Peminjaman</p><strong className="mt-2 block font-title-md text-title-md text-white">Maksimal 14 Hari Kalender</strong><span className="font-meta-sm text-meta-sm text-[#737373]">Dapat diperpanjang 1x melalui portal siswa</span></div><div className="p-5"><p className="font-meta-sm text-meta-sm uppercase text-[#737373]">Jam Layanan Sirkulasi</p><strong className="mt-2 block font-title-md text-title-md text-white">Senin – Jumat: 07.30 – 16.00 WIB</strong><span className="font-meta-sm text-meta-sm text-[#737373]">Layanan digital & katalog online 24 jam</span></div></section>
            </div>

            {selectedBook && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-md border border-[#2A2A2A] bg-[#242424] p-6"><p className="font-meta-sm text-meta-sm uppercase text-[#FACC15]">Formulir Peminjaman</p><h2 className="mt-2 font-headline-md text-headline-md text-white">{selectedBook.title}</h2><label className="mt-6 block font-label-md text-label-md text-[#A3A3A3]">Batas Pengembalian<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 block w-full border-b border-[#2A2A2A] bg-transparent py-3 text-white outline-none" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setSelectedBook(null)} className="border border-[#2A2A2A] px-4 py-2 text-label-md text-white">Batal</button><button type="button" onClick={confirmBorrow} className="rounded-md bg-[#DC2626] px-4 py-2 font-label-md text-label-md text-white">Konfirmasi</button></div></div></div>}
        </LibraryLayout>
    );
}
