<?php


namespace Delivery\Http\Controllers\Company;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Services\Company\CompanyDeliveryRateService;
use Illuminate\Http\Request;

class CompanyDeliveryRateController extends Controller
{
    private $service;

    public function __construct(CompanyDeliveryRateService $service)
    {
        $this->service = $service;
    }

    public function calculate($companyId, Request $request)
    {
        try {
            $result = $this->service
                ->calculate($companyId,$request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao obter tarifa");
        }

        return ApiResponse::success($result);

    }
}
