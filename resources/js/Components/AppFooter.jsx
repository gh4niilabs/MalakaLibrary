export default function AppFooter() {
    return (
        <footer className="border-t border-white/[0.04] py-10 px-5 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <img src="/logo.png" alt="ML" className="w-6 h-6 rounded-md object-contain" />
                    <span className="font-display text-sm text-white/60">
                        Perpustakaan <span className="text-amber-400/70">Digital</span>
                    </span>
                </div>
                <p className="text-white/20 text-xs">Proyek Tugas — SMK RPL &copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}
