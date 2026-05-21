import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function LoginAdmin({ flash }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (flash?.error) alert(flash.error);
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.submit'));
    };

    return (
        <>
            <Head title="Admin Login — Malaka Library" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .fade-up { animation: fadeUp 0.5s ease-out both; }
            `}</style>

            {/* Container utama untuk Centering — sama kayak Login user */}
            <div className="min-h-screen w-full flex items-center justify-center p-4 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
                
                {/* Background Fixed — sama kayak Login user */}
                <img src="/images/library-bg.png" alt="" className="fixed inset-0 w-full h-full object-cover" />
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

                {/* ── Kotak Form Compact (sama kayak Login user) ── */}
                <div className="relative w-full max-w-[380px] fade-up z-10">
                    <div className="bg-[#111111]/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8">

                        {/* Logo + Title — bedanya cuma tulisan ADMIN */}
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3">
                                <img src="/logo.png" alt="Malaka Library" className="w-16 h-16 object-contain drop-shadow-lg" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                <span className="text-white">ADMIN </span>
                                <span className="text-red-500">PANEL</span>
                            </h1>
                            <p className="text-white/30 text-[10px] mt-1.5 tracking-wider uppercase font-medium">Malaka Library</p>
                        </div>

                        {/* Form — mirip Login user */}
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Email Admin</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="admin@mail.com"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all duration-300"
                                        required
                                    />
                                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Masukkan password"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-11 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all duration-300"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors" tabIndex={-1}>
                                        {showPassword
                                            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        }
                                    </button>
                                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500 ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            {/* Remember & Back */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="w-3.5 h-3.5 rounded border-white/10 bg-white/[0.04] text-red-600 focus:ring-red-500/30 focus:ring-offset-0" />
                                    <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">Ingat saya</span>
                                </label>
                                <a href="/" className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors font-medium">← Kembali</a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-2.5 mt-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-white bg-gradient-to-r from-red-800 via-red-700 to-red-800 hover:from-red-700 hover:via-red-600 hover:to-red-700 shadow-lg shadow-red-900/30 transition-all duration-300 ${processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'MEMPROSES...' : '🔐 MASUK ADMIN'}
                            </button>
                        </form>

                        <div className="text-center text-xs mt-5">
                            <span className="text-white/40">Bukan admin? </span>
                            <a href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">Login sebagai user</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
