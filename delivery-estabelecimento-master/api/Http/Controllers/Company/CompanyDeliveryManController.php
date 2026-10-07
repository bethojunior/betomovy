<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyDeliveryManService;

class CompanyDeliveryManController
{
    private $service;

    public function __construct(CompanyDeliveryManService $service)
    {
        $this->service = $service;
    }

    /**
     * @param $companyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function findDeliveryManByCompany($companyId)
    {
        try {
            $result = $this->service->findDeliveryManByCompanyId($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result, "listagem de entregadores");
    }

    /**
     * @param $companyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function findDeliveryManActiveByCompany($companyId)
    {
        try {
            $result = $this->service->findDeliveryManActiveByCompanyId($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result, "listagem de entregadores");
    }
}
