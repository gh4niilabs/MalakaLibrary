import { Head, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import LibraryLayout from '@/Layouts/LibraryLayout';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const avatarInput = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const profile = useForm({ _method: 'PATCH', name: user.name ?? '', email: user.email ?? '', avatar: null });
    const password = useForm({ current_password: '', password: '', password_confirmation: '' });
    const deletion = useForm({ password: '' });
    const avatarUrl = avatarPreview || (user.avatar ? `/storage/${user.avatar}` : null);

    const submitProfile = (event) => { event.preventDefault(); profile.post(route('profile.update'), { forceFormData: true, preserveScroll: true }); };
    const submitPassword = (event) => { event.preventDefault(); password.put(route('password.update'), { preserveScroll: true, onSuccess: () => password.reset() }); };
    const submitDelete = (event) => { event.preventDefault(); deletion.delete(route('profile.destroy'), { preserveScroll: true, onError: () => deletion.reset('password') }); };
    const selectAvatar = (event) => { const file = event.target.files?.[0]; if (!file) return; profile.setData('avatar', file); setAvatarPreview(URL.createObjectURL(file)); };
    const field = 'w-full rounded-none border-0 border-b border-[#2A2A2A] bg-transparent px-0 py-2 font-body-md text-body-md text-[#E5E2E1] outline-none transition-colors placeholder:text-[#5C403C] focus:border-[#E5E2E1]';

    return (
        <LibraryLayout auth={auth} title="Profil Saya">
            <Head><meta name="description" content="Pengaturan profil anggota Malaka Library." /></Head>
            <div className="mx-auto w-full max-w-[640px] px-4 py-10 text-left sm:px-6 md:py-12">
                <div className="mb-8"><div className="mb-1 font-meta-sm text-meta-sm uppercase tracking-widest text-[#AC8884]">Pengaturan Akun / Anggota</div><h1 className="font-display text-display text-[#E5E2E1]">Profil Saya</h1></div>
                <div className="mb-8 flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2A2A2A] font-title-md text-title-md text-[#E5E2E1]">{avatarUrl ? <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" /> : user.name?.charAt(0)?.toUpperCase()}</div><div className="flex min-w-0 flex-col"><span className="truncate font-title-md text-title-md text-[#E5E2E1]">{user.name}</span><span className="truncate font-body-md text-body-md text-[#AC8884]">{user.email}</span><span className="font-meta-sm text-meta-sm text-[#5C403C]">Anggota Aktif</span></div></div>
                <div className="mb-8 h-px w-full bg-[#2A2A2A]" />

                <section className="mb-8"><h2 className="mb-6 font-title-md text-title-md text-[#E5E2E1]">Data diri</h2><form onSubmit={submitProfile} className="space-y-6"><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Nama lengkap<input className={field} value={profile.data.name} onChange={(e) => profile.setData('name', e.target.value)} required /><InputError message={profile.errors.name} /></label><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Alamat surel / email<input className={field} type="email" value={profile.data.email} onChange={(e) => profile.setData('email', e.target.value)} required /><InputError message={profile.errors.email} /></label><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Nomor Induk Siswa Nasional (NISN)<input className="w-full cursor-not-allowed rounded-none border-0 border-b border-[#2A2A2A] bg-transparent px-0 py-2 font-body-md text-body-md text-[#737373]" value="Tidak tersedia dari backend" disabled readOnly /></label><div><button type="button" onClick={() => avatarInput.current?.click()} className="font-body-md text-body-md text-[#AC8884] underline underline-offset-4 hover:text-[#E5E2E1]">Ganti foto profil</button><input ref={avatarInput} type="file" accept="image/jpeg,image/png" className="hidden" onChange={selectAvatar} /><InputError message={profile.errors.avatar} /></div><div className="flex items-center gap-4 pt-2"><button type="submit" disabled={profile.processing} className="rounded-md bg-[#DC2626] px-4 py-2 font-label-md text-label-md text-white hover:bg-[#B91C1C] disabled:opacity-50">Simpan</button>{profile.recentlySuccessful && <span className="font-meta-sm text-meta-sm text-[#FACC15]">Tersimpan</span>}</div></form></section>
                <div className="mb-8 h-px w-full bg-[#2A2A2A]" />

                <section className="mb-8"><h2 className="mb-6 font-title-md text-title-md text-[#E5E2E1]">Ganti password</h2><form onSubmit={submitPassword} className="space-y-6"><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Password saat ini<input className={field} type="password" value={password.data.current_password} onChange={(e) => password.setData('current_password', e.target.value)} placeholder="Masukkan kata sandi lama" /><InputError message={password.errors.current_password} /></label><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Password baru<input className={field} type="password" value={password.data.password} onChange={(e) => password.setData('password', e.target.value)} placeholder="Minimal 8 karakter alfanumerik" /><InputError message={password.errors.password} /></label><label className="flex flex-col font-meta-sm text-meta-sm text-[#AC8884]">Konfirmasi password baru<input className={field} type="password" value={password.data.password_confirmation} onChange={(e) => password.setData('password_confirmation', e.target.value)} placeholder="Ulangi kata sandi baru" /><InputError message={password.errors.password_confirmation} /></label><button type="submit" disabled={password.processing} className="border border-[#2A2A2A] px-4 py-2 font-label-md text-label-md text-[#E5E2E1] hover:border-[#737373] disabled:opacity-50">Perbarui password</button></form></section>
                <div className="mb-8 h-px w-full bg-[#2A2A2A]" />

                <section><h2 className="font-title-md text-title-md text-[#E5E2E1]">Hapus akun</h2><p className="mt-2 font-body-md text-body-md leading-relaxed text-[#AC8884]">Menghapus akun akan membatalkan seluruh hak akses digital dan menghapus daftar favorit.</p>{!deleteOpen ? <button type="button" onClick={() => setDeleteOpen(true)} className="mt-5 font-body-md text-body-md text-[#DC2626] underline underline-offset-4">Hapus akun</button> : <form onSubmit={submitDelete} className="mt-5 flex flex-wrap items-end gap-3"><label className="flex flex-1 flex-col font-meta-sm text-meta-sm text-[#AC8884]">Konfirmasi password<input className={field} type="password" value={deletion.data.password} onChange={(e) => deletion.setData('password', e.target.value)} required /></label><button type="submit" className="bg-[#93000A] px-4 py-2 font-label-md text-label-md text-white">Konfirmasi hapus</button></form>}</section>
                {mustVerifyEmail && user.email_verified_at === null && <p className="mt-6 font-meta-sm text-meta-sm text-[#FACC15]">Email belum diverifikasi. {status}</p>}
            </div>
        </LibraryLayout>
    );
}
