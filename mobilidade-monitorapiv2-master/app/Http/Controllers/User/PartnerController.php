<?php


namespace App\Http\Controllers\User;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\User\PartnerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    private $service;

    public function __construct(PartnerService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityId'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar parceiros");
        }

        return ApiResponse::success($data);
    }
}
