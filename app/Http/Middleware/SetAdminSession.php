<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware ini WAJIB jalan SEBELUM StartSession.
 * Tugasnya: ganti session cookie name untuk admin routes
 * supaya admin dan member punya SESSION TERPISAH.
 * 
 * Tanpa ini, login admin dan member bakal saling nabrak
 * karena mereka share session cookie yang sama.
 */
class SetAdminSession
{
    public function handle(Request $request, Closure $next): Response
    {
        // Kalau ini admin route, pake cookie terpisah
        if ($request->is('admin/*') || $request->is('admin')) {
            config([
                'session.cookie' => config('session.cookie') . '_admin',
            ]);
        }

        return $next($request);
    }
}
