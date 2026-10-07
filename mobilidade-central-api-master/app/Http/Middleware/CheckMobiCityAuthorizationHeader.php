<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;

class CheckMobiCityAuthorizationHeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $expectedToken = env('MOBICITY_CUID_WEBHOOK_TOKEN');

        $authorizationHeader = $request->header('Authorization');

        if (!$authorizationHeader) {
            return response()->json([
                'error' => 'Authorization header is missing.'
            ], 401);
        }

        if ($authorizationHeader !== $expectedToken) {
            return response()->json([
                'error' => 'Invalid token.'
            ], 403);
        }

        return $next($request);
    }

}
