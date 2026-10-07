<?php

namespace App\Http\Controllers\Ifood;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\Ifood\IfoodService;

class IfoodController extends Controller
{

    private IfoodService $ifoodService;

    public function __construct(IfoodService $ifoodService)
    {
        $this->ifoodService = $ifoodService;
    }

    public function handle($centralId, Request $request) {
        $execute = $this->ifoodService->instanceTrip($request->all(), $centralId);
        return response()->json($execute);
    }

    public function contactSupport(Request $request): JsonResponse
    {
        $config = DB::table('config')
            ->where('key', 'support_help_phone')
            ->first();

        if (!$config) {
            return response()->json([
                'message' => 'Support phone not configured.',
            ], 404);
        }

        $phone = preg_replace('/\D/', '', $config->value);
        $tripDetails = "https://" . $request->app . "-lite.704apps.com.br";
        $link = "https://wa.me/{$phone}?text=Suporte%20a%20entregas%20" . $tripDetails;
        return response()->json(['message' => $link],200);
    }

}
