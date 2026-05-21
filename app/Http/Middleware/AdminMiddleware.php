<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::guard('admin')->check()) {
            return redirect('/admin/login')->with('error', 'Silakan login terlebih dahulu.');
        }

        $role = Auth::guard('admin')->user()->role;

        // Admin DAN Petugas boleh masuk dashboard
        if (!in_array($role, ['admin', 'petugas'])) {
            Auth::guard('admin')->logout();
            return redirect('/admin/login')->with('error', 'Akses ditolak.');
        }

        return $next($request);
    }
}
