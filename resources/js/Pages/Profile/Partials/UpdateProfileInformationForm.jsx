import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        _method: 'PATCH',
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const [focusedField, setFocusedField] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarError, setAvatarError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const currentAvatarUrl = user.avatar ? `/storage/${user.avatar}` : null;
    const displayAvatar = avatarPreview || currentAvatarUrl;

    const handleAvatarChange = (file) => {
        setAvatarError('');
        if (!file) return;
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
            || /\.(jpg|jpeg|png)$/i.test(file.name);
        if (!allowed) { setAvatarError('Hanya file JPG atau PNG yang diperbolehkan.'); return; }
        if (file.size > 2 * 1024 * 1024) { setAvatarError('Ukuran file maksimal 2MB.'); return; }
        setData('avatar', file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        setAvatarPreview(null);
        setData('avatar', null);
        setAvatarError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'));
    };

    return (
        <section className={className}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-base font-bold text-white tracking-tight">Profile Information</h2>
                    <p className="text-white/30 text-xs mt-0.5">Update nama, email, dan foto profilmu</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">

                {/* ── Avatar Upload ── */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-white/70">Foto Profil</span>
                        <span className="text-xs text-white/20">— JPG atau PNG, maks 2MB</span>
                    </div>

                    <div className="flex items-start gap-4">
                        {/* Avatar circle */}
                        <div className="flex-shrink-0 relative group">
                            {displayAvatar ? (
                                <img
                                    src={displayAvatar}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 shadow-xl shadow-black/40"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-800/50 to-amber-800/30 border border-white/[0.06] flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            {/* Hover overlay */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            {/* Remove button */}
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={removeAvatar}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Drop zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleAvatarChange(e.dataTransfer.files[0]); }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex-1 min-h-[80px] border-2 border-dashed rounded-2xl px-4 py-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 text-center ${
                                isDragging
                                    ? 'border-amber-500/50 bg-amber-500/[0.05]'
                                    : avatarError
                                    ? 'border-red-500/40 bg-red-500/[0.04]'
                                    : 'border-white/[0.07] bg-white/[0.02] hover:border-amber-500/25 hover:bg-amber-500/[0.03]'
                            }`}
                        >
                            <svg className={`w-6 h-6 transition-colors ${isDragging ? 'text-amber-400' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-amber-400' : 'text-white/40'}`}>
                                {isDragging ? 'Lepas di sini...' : 'Klik atau drag & drop'}
                            </p>
                            <p className="text-xs text-white/20">JPG atau PNG, maks 2MB</p>
                        </div>

                        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="hidden" onChange={(e) => handleAvatarChange(e.target.files[0])} />
                    </div>

                    {avatarError && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            {avatarError}
                        </p>
                    )}
                    {errors.avatar && <InputError className="mt-2" message={errors.avatar} />}
                    {avatarPreview && (
                        <p className="mt-2 text-xs text-amber-400 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Foto baru dipilih — simpan untuk menerapkan.
                        </p>
                    )}
                </div>

                {/* ── Name ── */}
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Nama</label>
                    <div className="relative">
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            required
                            autoComplete="name"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all duration-300"
                        />
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500 ${focusedField === 'name' ? 'w-full' : 'w-0'}`} />
                    </div>
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* ── Email ── */}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                            autoComplete="username"
                            className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/10 transition-all duration-300"
                        />
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                    </div>
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                        <p className="text-sm text-amber-400/80">
                            Email belum diverifikasi.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-semibold underline underline-offset-2 text-amber-400 hover:text-amber-300"
                            >
                                Kirim ulang link verifikasi.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm text-emerald-400">Link verifikasi baru telah dikirim.</p>
                        )}
                    </div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing || !!avatarError}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-700 via-red-600 to-amber-700 shadow-lg shadow-red-900/20 hover:shadow-red-800/30 hover:from-red-600 hover:to-amber-600 focus:outline-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${(processing || !!avatarError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {processing ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        leave="transition ease-in duration-200"
                        leaveTo="opacity-0 translate-x-2"
                    >
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/10 px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Tersimpan!
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
