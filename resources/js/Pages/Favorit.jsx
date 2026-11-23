import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import LibraryLayout from '@/Layouts/LibraryLayout';

export default function Favorit({ auth, books = [] }) {
    const [query, setQuery] = useState('');
    const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())), [books, query]);

    return (
        <LibraryLayout auth={auth} title="Favorit">
            <Head><meta name="description" content="Daftar buku favorit Malaka Library." /></Head>
            <div className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-[1200px] flex-col px-4 py-10 sm:px-6 md:py-16">
                <section className="flex flex-col justify-between gap-6 border-b border-[#2A2A2A] pb-7 md:flex-row md:items-end"><div><h1 className="font-display text-display text-white">Favorit</h1><p className="mt-2 font-body-lg text-body-lg text-[#A3A3A3]">Daftar buku pilihan yang Anda simpan untuk dibaca atau dipinjam.</p></div><label className="flex w-full items-center gap-3 border-b border-[#2A2A2A] py-2 md:max-w-[360px]"><span className="text-xl text-[#737373]">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari di favorit..." className="w-full bg-transparent font-body-md text-body-md text-white outline-none placeholder:text-[#737373]" /></label></section>

                {visibleBooks.length === 0 ? (
                    <section className="flex flex-1 items-center justify-center py-20 text-center"><div><p className="font-body-lg text-body-lg text-[#A3A3A3]">Belum ada favorit</p><Link href={route('katalog.index')} className="mt-8 inline-block rounded-md bg-[#DC2626] px-6 py-3 font-label-md text-label-md font-medium text-white hover:bg-[#B91C1C]">Jelajahi Katalog</Link></div></section>
                ) : (
                    <section className="grid grid-cols-2 gap-4 py-12 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">{visibleBooks.map((book) => <article key={book.id} className="flex flex-col rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-3.5"><div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#0F0F0F]">{book.cover ? <img src={book.cover} alt={book.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-3 text-center font-headline-sm text-headline-sm text-white">{book.title}</div>}<button type="button" onClick={() => router.post(route('favorites.toggle', book.id), {}, { preserveScroll: true })} className="absolute right-3 top-3 text-2xl leading-none text-[#DC2626]" aria-label={`Hapus ${book.title} dari favorit`}>♡</button></div><span className="mt-4 w-fit border border-[#2A2A2A] px-2 py-1 font-body-md text-body-md text-[#A3A3A3]">{book.categories?.[0]?.name ?? 'Koleksi'}</span><h2 className="mt-3 line-clamp-1 font-headline-sm text-headline-sm text-white">{book.title}</h2><p className="mt-1 line-clamp-1 font-body-lg text-body-lg text-[#A3A3A3]">{book.author}</p><Link href={route('katalog.index')} className="mt-auto pt-6"><span className="block rounded-md bg-[#DC2626] px-3 py-2 text-center font-label-md text-label-md font-medium text-white hover:bg-[#B91C1C]">Pinjam</span></Link></article>)}</section>
                )}
            </div>
        </LibraryLayout>
    );
}
