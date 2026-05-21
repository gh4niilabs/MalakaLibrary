<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // Kalau yang login adalah admin, tolak akses dan arahkan ke admin login
        if (Auth::user()->role === 'admin') {
            Auth::guard('web')->logout();
            
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Akun admin tidak bisa login dari sini. Silakan gunakan halaman Login Admin.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        // Invalidate session supaya database session driver bersih
        // Ini WAJIB buat database session driver, kalau nggak session jadi stale
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
