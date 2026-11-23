import { Head, Link } from '@inertiajs/react';
import LibraryLayout from '@/Layouts/LibraryLayout';

const fallbackBooks = [
    { id: 'b1', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', available: 4, category: 'Sastra' },
    { id: 'b2', title: 'Madilog', author: 'Tan Malaka', available: 2, category: 'Filsafat' },
    { id: 'b3', title: 'Fisika Dasar Jilid 1', author: 'David Halliday & Robert Resnick', available: 8, category: 'Sains' },
    { id: 'b4', title: 'Laskar Pelangi', author: 'Andrea Hirata', available: 5, category: 'Novel' },
    { id: 'b5', title: 'Biologi Seluler', author: 'Neil A. Campbell & Jane B. Reece', available: 6, category: 'Biologi' },
];

function BookCover({ book, className = '' }) {
    return book.cover ? (
        <img src={book.cover} alt={book.title} className={`h-full w-full object-cover ${className}`} />
    ) : (
        <div className={`flex h-full w-full items-center justify-center bg-[#1A1A1A] text-center ${className}`}>
            <span className="px-4 font-headline-sm text-headline-sm text-white">{book.title}</span>
        </div>
    );
}

export default function Welcome({ auth, popularBooks = [], latestReviews = [] }) {
    const books = popularBooks.length ? popularBooks : fallbackBooks;

    return (
        <LibraryLayout auth={auth} title="Malaka Library">
            <Head><meta name="description" content="Malaka Library, perpustakaan digital sekolah." /></Head>
            <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 md:py-16">
                <section className="grid grid-cols-1 items-center gap-8 border-b border-[#2A2A2A] pb-16 lg:grid-cols-12 lg:gap-12">
                    <div className="flex flex-col justify-center lg:col-span-7">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="inline-block h-2 w-2 bg-[#FACC15]" />
                            <span className="font-meta-sm text-meta-sm uppercase tracking-widest text-[#A3A3A3]">Perpustakaan Sekolah Malaka</span>
                        </div>
                        <h1 className="mb-4 font-display text-display text-white">Malaka Library</h1>
                        <p className="mb-8 max-w-xl font-body-lg text-body-lg leading-relaxed text-[#A3A3A3]">Akses literatur akademik terkurasi, sastra klasik, dan arsip referensi sekolah secara terpadu.</p>
                        <div className="flex items-center">
                            <Link href="/katalog" className="inline-flex items-center gap-2 rounded-md bg-[#DC2626] px-6 py-2.5 font-label-md text-label-md font-medium text-white transition-colors hover:bg-[#B91C1C]">Lihat Katalog <span aria-hidden="true">→</span></Link>
                            {!auth?.user && <Link href={route('register')} className="ml-6 font-body-md text-body-md font-medium text-white underline underline-offset-4 hover:text-white/80">Daftar</Link>}
                        </div>
                    </div>
                    <div className="flex items-center justify-center pt-6 lg:col-span-5 lg:justify-end lg:pt-0">
                        <div className="relative flex h-80 w-full max-w-[380px] select-none items-center">
                            {books.slice(0, 3).map((book, index) => (
                                <div key={book.id ?? index} className={`absolute bottom-4 aspect-[2/3] w-44 overflow-hidden rounded-md border border-[#2A2A2A] bg-[#1A1A1A] ${index === 0 ? 'left-0 -rotate-6' : index === 1 ? 'right-0 rotate-6' : 'relative z-10 mx-auto w-48'}`}>
                                    <BookCover book={book} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pt-12">
                    <div className="mb-8 flex items-baseline justify-between">
                        <h2 className="font-headline-lg text-headline-lg text-white">Buku Terpopuler</h2>
                        <Link href="/katalog" className="font-label-md text-label-md text-[#A3A3A3] hover:text-white">Lihat Semua →</Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
                        {books.slice(0, 5).map((book, index) => (
                            <article key={book.id ?? index} className="flex flex-col justify-between rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-3.5">
                                <div>
                                    <div className="relative mb-3 aspect-[2/3] w-full overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#0F0F0F]">
                                        <BookCover book={book} />
                                        <span className="absolute left-2 top-2 border border-[#2A2A2A] bg-[#0F0F0F]/90 px-1.5 py-0.5 font-label-md text-[10px] uppercase tracking-wider text-white">{book.category ?? book.categories?.[0]?.name ?? 'Koleksi'}</span>
                                    </div>
                                    <div className="mb-1.5 flex items-center justify-between font-meta-sm text-meta-sm">
                                        <span className="text-[#FACC15]">★ <span className="text-white">{book.rating ?? '4.9'}</span></span>
                                        <span className="text-[#A3A3A3]">Tersedia {book.available ?? 0} Eks.</span>
                                    </div>
                                    <h3 className="mb-1 line-clamp-1 font-headline-sm text-headline-sm text-white">{book.title}</h3>
                                    <p className="mb-4 line-clamp-1 font-body-md text-body-md text-[#A3A3A3]">{book.author}</p>
                                </div>
                                <Link href="/katalog" className="w-full rounded-md bg-[#DC2626] px-3 py-2 text-center font-label-md text-label-md font-medium text-white hover:bg-[#B91C1C]">Pinjam Buku</Link>
                            </article>
                        ))}
                    </div>
                </section>

                {latestReviews.length > 0 && (
                    <section className="border-t border-[#2A2A2A] pt-12">
                        <h2 className="mb-6 font-headline-lg text-headline-lg text-white">Ulasan Terbaru</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {latestReviews.map((review) => <article key={review.id} className="border border-[#2A2A2A] bg-[#1A1A1A] p-5"><p className="font-body-md text-body-md text-[#A3A3A3]">“{review.comment}”</p><p className="mt-4 font-meta-sm text-meta-sm text-[#737373]">{review.user_name} · {review.book_title}</p></article>)}
                        </div>
                    </section>
                )}
            </div>
        </LibraryLayout>
    );
}
