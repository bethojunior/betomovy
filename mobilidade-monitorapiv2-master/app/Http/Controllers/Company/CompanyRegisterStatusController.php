<?php

namespace App\Http\Controllers\Company;

use App\Http\Responses\ApiResponse;
use App\Services\Company\CompanyRegisterStatusService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompanyRegisterStatusController extends Controller
{
    /**
     * @var CompanyRegisterStatusService
     */
    private $service;

    public function __construct(CompanyRegisterStatusService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar os status de pessoas juridicas");
        }

        return ApiResponse::success($result);
    }
}
