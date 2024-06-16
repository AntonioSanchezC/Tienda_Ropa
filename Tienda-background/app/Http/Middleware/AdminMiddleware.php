<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        // Obtener el usuario autenticado
        $user = $request->user();

        // Verificar si el usuario está autenticado y es administrador
        if ($user && $user->admin == 1) {
            return $next($request);
        }

        // Si no es administrador, devolver una respuesta 403 (Forbidden)
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
