<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $expectedToken = env('AUDIT_API_TOKEN') ?? 'c9e03335-49d0-4995-8088-4de86a87acab';

        $token = $request->header('x-audit-token');

        if (!$token || $token !== $expectedToken) {
            return response()->json([
                'status' => false,
                'message' => 'Token inválido ou ausente'
            ], 403);
        }

        return $next($request);
    }
}
