<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\CompanyDeliveryConfigRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\CompanyDeliveryConfigService;
use Symfony\Component\HttpFoundation\Request;

class CompanyDeliveryConfigController extends Controller
{
    /**
     * @var CompanyDeliveryConfigService
     */
    private $service;

    public function __construct(CompanyDeliveryConfigService $service)
    {
        $this->service = $service;
    }

    public function insert(CompanyDeliveryConfigRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao criar configuração de delivery da empresa");
        }

        return ApiResponse::created($result);
    }

    public function findByCompany(int $companyId)
    {
        try {
            $result = $this->service
                ->findByCompany($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as configuracoes de delivery da empresa");
        }

        return ApiResponse::success($result);
    }

    public function update(int $companyId, CompanyDeliveryConfigRequest $request)
    {
        try {
            $result = $this->service
                ->update($companyId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar as configurações");
        }

        return ApiResponse::success($result);
    }

    public function companies(Request $request)
    {
        try {
            $result = $this->service
                ->findWithCompanies($request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações com empresas");
        }

        return ApiResponse::success($result);
    }
}
