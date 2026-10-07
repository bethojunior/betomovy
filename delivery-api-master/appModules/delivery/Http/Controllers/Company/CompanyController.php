<?php

namespace Delivery\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Services\Company\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * @var CompanyService
     */
    private $service;

    public function __construct(CompanyService $service)
    {
        $this->service = $service;
    }

    public function findNear(Request $request)
    {
        try {
            $result = $this->service
                ->findNear($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar lista de deliveries");
        }

        return ApiResponse::success($result);
    }

    public function findRandom()
    {
        try {
            $result = $this->service
                ->findRandom();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar lista de deliveries");
        }

        return ApiResponse::success($result);
    }
}
