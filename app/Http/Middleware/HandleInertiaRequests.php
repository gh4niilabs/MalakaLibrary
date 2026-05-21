<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Cek apakah request ini untuk halaman admin (prefix /admin)
        $isAdminRoute = $request->is('admin/*') || $request->is('admin');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $isAdminRoute
                    ? Auth::guard('admin')->user()
                    : Auth::guard('web')->user(),
                'role' => $isAdminRoute
                    ? (Auth::guard('admin')->user()?->role ?? null)
                    : (Auth::guard('web')->user()?->role ?? 'member'),
            ],
            // Share flash messages ke semua page
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
