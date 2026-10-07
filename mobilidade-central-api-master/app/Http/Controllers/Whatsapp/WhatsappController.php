<?php

namespace App\Http\Controllers\Whatsapp;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Whatsapp\WhatsappService;

class WhatsappController extends Controller
{
    private WhatsappService $whatsappService;

    public function __construct(WhatsappService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function calculatePrice(Request $request)
    {
        try {
            return response()->json($this->whatsappService->calculatePrice($request->all()));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function newTrip(Request $request)
    {
        try {
            return response()->json($this->whatsappService->newTrip($request->all()));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function findUserByPhoneAndCentral($centralId, $phone)
    {
        try {
            $user = $this->whatsappService->findUserByPhoneAndCentral($centralId, $phone);

            if (!$user) {
                return response()->json(['error' => 'Usuário não encontrado'], 404);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function cancelTrip($phone)
    {
        try {
            return response()->json($this->whatsappService->cancelTrip($phone));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function hasActiveTrip($phone)
    {
        return response()->json(['hasActiveTrip' => $this->whatsappService->hasActiveTrip($phone)]);
    }
}
