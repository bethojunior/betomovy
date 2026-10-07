<?php


namespace App\Http\Controllers\User;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\User\DriverAppInfoService;
use Illuminate\Http\Request;

class DriverAppInfoController extends Controller
{
    private $service;

    public function __construct(DriverAppInfoService $service)
    {
        $this->service = $service;
    }

    public function findByDriver($driverId, Request $request)
    {
        try {
            $result = $this->service->findByDriver($driverId, $request->get('date'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao lista histórico de debug");
        }

        return ApiResponse::success($result);
    }
}
