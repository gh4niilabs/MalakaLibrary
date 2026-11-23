export default function AppFooter() {
    return (
        <footer className="w-full border-t border-[#2A2A2A] bg-[#0F0F0F] py-8">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                <p className="font-meta-sm text-meta-sm text-[#737373]">© 2025 Perpustakaan Sekolah Malaka. Hak Cipta Dilindungi.</p>
                <div className="flex items-center gap-6 font-meta-sm text-meta-sm text-[#737373]">
                    <a href="/about" className="transition-colors hover:text-white">Tentang Kami</a>
                    <a href="/katalog" className="transition-colors hover:text-white">Katalog Buku</a>
                    <a href="/riwayat" className="transition-colors hover:text-white">Riwayat</a>
                </div>
            </div>
        </footer>
    );
}
