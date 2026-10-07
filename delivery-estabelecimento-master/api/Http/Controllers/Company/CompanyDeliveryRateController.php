<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyDeliveryRateService;
use App\Http\Controllers\Controller;

class CompanyDeliveryRateController extends Controller
{
    private $service;

    public function __construct(CompanyDeliveryRateService $service)
    {
        $this->service = $service;
    }

    public function findByCompany($companyId)
    {
        try {
            $results = $this->service->findByCompany($companyId);
        }catch (\Exception $e){
            return ApiResponse::error($e,"Ocorreu um erro ao pega taritas");
        }

        return ApiResponse::success($results);
    }
}
