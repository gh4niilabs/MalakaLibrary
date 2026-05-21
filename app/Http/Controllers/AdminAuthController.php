<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    /**
     * Tampilkan halaman login admin.
     */
    public function showLogin()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/LoginAdmin');
    }

    /**
     * Proses login admin.
     * Sekarang AMAN pake regenerate() karena admin punya session cookie TERPISAH.
     * Session member (cookie laravel-session) TIDAK akan terganggu.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('admin')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {

            if (!in_array(Auth::guard('admin')->user()->role, ['admin', 'petugas'])) {
                Auth::guard('admin')->logout();
                return back()->with('error', 'Akun ini bukan admin/petugas. Gunakan halaman login biasa.');
            }

            // AMAN: regenerate session karena ini session admin terpisah
            $request->session()->regenerate();

            return redirect()->route('admin.dashboard');
        }

        return back()->with('error', 'Email atau password salah.');
    }

    /**
     * Proses logout admin.
     * AMAN: invalidate hanya membunuh session admin, member session tetap hidup.
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        // AMAN: invalidate karena ini session cookie admin terpisah
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
