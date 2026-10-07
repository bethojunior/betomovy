<?php

namespace App\Http\Controllers\Mobicity;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Mobicity\MobicityService;

class MobicityController extends Controller
{

    private MobicityService $mobicityService;

    public function __construct(MobicityService $mobicityService)
    {
        $this->mobicityService = $mobicityService;
    }

    public function calculatePrice($centralId, Request $request)
    {
        $execute = $this->mobicityService->calculatePrice($request->all(), $centralId);
        return response()->json($execute);
    }

    public function newTrip($centralId, Request $request)
    {
        $execute = $this->mobicityService->newTrip($request->all(), $centralId);
        return response()->json($execute);
    }

}
