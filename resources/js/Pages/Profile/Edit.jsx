import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState, useEffect } from 'react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const avatarUrl = user.avatar ? `/storage/${user.avatar}` : null;

    const sections = [
        { id: 'profile', label: 'Profile',     emoji: '👤', accent: 'amber' },
        { id: 'password', label: 'Password',   emoji: '🔒', accent: 'red'   },
        { id: 'danger',   label: 'Danger Zone', emoji: '⚠️', accent: 'red'   },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-card { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
            `}</style>

            <div className="min-h-screen bg-[#0f0f12]">
                <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-7">

                    {/* ── Profile Hero Header ── */}
                    <div
                        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        style={{ background: 'linear-gradient(135deg, #141414 0%, #1a1010 100%)' }}
                    >
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.04] rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/[0.03] rounded-full blur-[60px]" />
                        {/* Top accent line */}
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            {/* Avatar display */}
                            <div className="relative flex-shrink-0">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={user.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/[0.06] shadow-2xl shadow-black/50"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-700 via-red-700 to-amber-700 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-2xl shadow-red-900/30 ring-4 ring-white/[0.06]">
                                        {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                                    </div>
                                )}
                                {/* Online indicator */}
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#141414]" />
                            </div>

                            {/* User info */}
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    {user.name}
                                </h1>
                                <p className="text-white/40 text-sm mt-1">{user.email}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/[0.08] border border-amber-500/10 text-amber-400 text-[11px] font-semibold tracking-wide">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        Member Aktif
                                    </span>
                                    {user.email_verified_at && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/10 text-emerald-400 text-[11px] font-semibold">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Terverifikasi
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section quick nav pills */}
                        <div className="relative flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/[0.05]">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setActiveSection(s.id);
                                        document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                                        activeSection === s.id
                                            ? s.accent === 'amber'
                                                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                                                : 'bg-red-500/20 border border-red-500/30 text-red-400'
                                            : 'bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {s.emoji} {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Profile Information Card ── */}
                    <div
                        id="section-profile"
                        onMouseEnter={() => setActiveSection('profile')}
                        className={`fade-card relative rounded-3xl overflow-hidden border border-white/[0.05] bg-[#111111] transition-all duration-500 hover:border-amber-500/10 ${mounted ? '' : 'opacity-0'}`}
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.02] rounded-full blur-[60px]" />
                        <div className="relative p-7 sm:p-9">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    {/* ── Update Password Card ── */}
                    <div
                        id="section-password"
                        onMouseEnter={() => setActiveSection('password')}
                        className={`fade-card relative rounded-3xl overflow-hidden border border-white/[0.05] bg-[#111111] transition-all duration-500 hover:border-red-500/[0.08] ${mounted ? '' : 'opacity-0'}`}
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/[0.02] rounded-full blur-[60px]" />
                        <div className="relative p-7 sm:p-9">
                            <UpdatePasswordForm />
                        </div>
                    </div>

                    {/* ── Danger Zone Card ── */}
                    <div
                        id="section-danger"
                        onMouseEnter={() => setActiveSection('danger')}
                        className={`fade-card relative rounded-3xl overflow-hidden border border-red-900/20 bg-[#111111] transition-all duration-500 hover:border-red-600/20 ${mounted ? '' : 'opacity-0'}`}
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/[0.03] rounded-full blur-[60px]" />
                        <div className="relative p-7 sm:p-9">
                            <DeleteUserForm />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
