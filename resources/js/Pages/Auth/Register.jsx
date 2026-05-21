import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputCls = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all duration-300";
    const inputClsR = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-11 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all duration-300";
    const textareaCls = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-all duration-300 resize-none";

    const EyeBtn = ({ show, onClick }) => (
        <button type="button" onClick={onClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors" tabIndex={-1}>
            {show
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            }
        </button>
    );

    const FocusLine = ({ field }) => (
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500 ${focusedField === field ? 'w-full' : 'w-0'}`} />
    );

    return (
        <>
            <Head title="Register — Malaka Library" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .fade-up { animation: fadeUp 0.5s ease-out both; }
            `}</style>

            {/* Container utama untuk Centering */}
            <div className="min-h-screen w-full flex items-center justify-center p-4 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
                
                {/* Background dibikin Fixed biar kotak beneran melayang */}
                <img src="/images/library-bg.png" alt="" className="fixed inset-0 w-full h-full object-cover" />
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

                {/* ── Kotak Form Compact (Maksimal 420px) ── */}
                <div className="relative w-full max-w-[420px] fade-up z-10">
                    <div className="bg-[#111111]/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8">

                        {/* Logo + Title */}
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-3">
                                <img src="/logo.png" alt="Malaka Library" className="w-16 h-16 object-contain drop-shadow-lg" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                <span className="text-white">MALAKA </span>
                                <span className="text-red-500">LIBRARY</span>
                            </h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} placeholder="Nama lengkap" required className={inputCls} />
                                    <FocusLine field="name" />
                                </div>
                                <InputError message={errors.name} className="mt-1 text-xs" />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} placeholder="Email aktif" required className={inputCls} />
                                    <FocusLine field="email" />
                                </div>
                                <InputError message={errors.email} className="mt-1 text-xs" />
                            </div>

                            {/* No. Telepon */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">No. Telepon</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <input id="phone" type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} placeholder="08xxxxxxxxxx" required className={inputCls} />
                                    <FocusLine field="phone" />
                                </div>
                                <InputError message={errors.phone} className="mt-1 text-xs" />
                            </div>

                            {/* Alamat */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Alamat</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-3 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)} placeholder="Alamat lengkap" required rows={2} className={textareaCls} />
                                    <FocusLine field="address" />
                                </div>
                                <InputError message={errors.address} className="mt-1 text-xs" />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={data.password} onChange={(e) => setData('password', e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder="Buat password" required className={inputClsR} />
                                    <EyeBtn show={showPassword} onClick={() => setShowPassword(!showPassword)} />
                                    <FocusLine field="password" />
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Konfirmasi Password</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <input id="password_confirmation" type={showConfirm ? 'text' : 'password'} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)} placeholder="Ulangi password" required className={inputClsR} />
                                    <EyeBtn show={showConfirm} onClick={() => setShowConfirm(!showConfirm)} />
                                    <FocusLine field="confirm" />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-2.5 mt-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] text-white bg-gradient-to-r from-red-800 via-red-700 to-red-800 hover:from-red-700 hover:via-red-600 hover:to-red-700 shadow-lg shadow-red-900/30 transition-all duration-300 ${processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
                            </button>
                        </form>

                        <div className="text-center text-xs mt-5">
                            <span className="text-white/40">Sudah punya akun? </span>
                            <Link href={route('login')} className="text-red-400 hover:text-red-300 font-semibold transition-colors">Login di sini</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}