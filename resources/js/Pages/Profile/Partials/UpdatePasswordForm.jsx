import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState, useMemo } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength calculator
    const passwordStrength = useMemo(() => {
        const pwd = data.password;
        if (!pwd) return { score: 0, label: '', color: '', width: '0%' };

        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z\d]/.test(pwd)) score++;

        const levels = [
            { score: 0, label: '', color: '', width: '0%' },
            { score: 1, label: 'Lemah', color: 'bg-red-500', width: '20%' },
            { score: 2, label: 'Kurang', color: 'bg-orange-500', width: '40%' },
            { score: 3, label: 'Cukup', color: 'bg-yellow-500', width: '60%' },
            { score: 4, label: 'Kuat', color: 'bg-emerald-500', width: '80%' },
            { score: 5, label: 'Sangat Kuat', color: 'bg-emerald-600', width: '100%' },
        ];

        return levels[Math.min(score, 5)];
    }, [data.password]);

    // Password match check
    const passwordsMatch = useMemo(() => {
        if (!data.password || !data.password_confirmation) return null;
        return data.password === data.password_confirmation;
    }, [data.password, data.password_confirmation]);

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const TogglePasswordButton = ({ show, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-200"
            tabIndex={-1}
        >
            {show ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );

    return (
        <section className={className}>
            <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-white tracking-tight">Update Password</h2>
                    <p className="text-white/30 text-xs mt-0.5">Gunakan password yang panjang dan acak untuk keamanan</p>
                </div>
            </div>

            <form onSubmit={updatePassword} className="mt-8 space-y-6">
                {/* Current Password */}
                <div>
                    <label htmlFor="current_password" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Password Saat Ini</label>
                    <div className="relative">
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            onFocus={() => setFocusedField('current_password')}
                            onBlur={() => setFocusedField(null)}
                            type={showCurrentPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                        />
                        <TogglePasswordButton show={showCurrentPassword} onClick={() => setShowCurrentPassword(!showCurrentPassword)} />
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500 ${focusedField === 'current_password' ? 'w-full' : 'w-0'}`} />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Password Baru</label>
                    <div className="relative">
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            type={showNewPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                        />
                        <TogglePasswordButton show={showNewPassword} onClick={() => setShowNewPassword(!showNewPassword)} />
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500 ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
                    </div>

                    {/* Password strength indicator */}
                    {data.password && (
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-white/30">Kekuatan Password</span>
                                <span className={`text-xs font-bold ${
                                    passwordStrength.score <= 2 ? 'text-red-400' :
                                    passwordStrength.score <= 3 ? 'text-amber-400' :
                                    'text-emerald-400'
                                }`}>{passwordStrength.label}</span>
                            </div>
                            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ease-out ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-2">
                                {[
                                    { check: data.password.length >= 8, label: 'Min 8 karakter' },
                                    { check: /[A-Z]/.test(data.password), label: 'Huruf besar' },
                                    { check: /[a-z]/.test(data.password), label: 'Huruf kecil' },
                                    { check: /\d/.test(data.password), label: 'Angka' },
                                    { check: /[^a-zA-Z\d]/.test(data.password), label: 'Simbol' },
                                    { check: data.password.length >= 12, label: 'Min 12 karakter' },
                                ].map((req, i) => (
                                    <div key={i} className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${req.check ? 'text-emerald-400' : 'text-white/20'}`}>
                                        {req.check
                                            ? <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                            : <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2" /></svg>
                                        }
                                        {req.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            onFocus={() => setFocusedField('password_confirmation')}
                            onBlur={() => setFocusedField(null)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 pr-12 text-white text-sm outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                        />
                        <TogglePasswordButton show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500 ${focusedField === 'password_confirmation' ? 'w-full' : 'w-0'}`} />
                    </div>
                    {passwordsMatch !== null && (
                        <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                            {passwordsMatch
                                ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg> Password cocok!</>
                                : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg> Password tidak cocok</>
                            }
                        </div>
                    )}
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-700 shadow-lg shadow-red-900/20 hover:from-red-600 hover:to-amber-600 focus:outline-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {processing
                            ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        }
                        {processing ? 'Updating...' : 'Update Password'}
                    </button>
                    <Transition show={recentlySuccessful} enter="transition ease-out duration-300" enterFrom="opacity-0 translate-x-2" leave="transition ease-in duration-200" leaveTo="opacity-0 translate-x-2">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/10 px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            Tersimpan!
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
