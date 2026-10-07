<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyDeliveryOrderConfigService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CompanyDeliveryOrderConfigController extends Controller
{
    /**
     * @var CompanyDeliveryOrderConfigService
     */
    private $service;

    public function __construct(CompanyDeliveryOrderConfigService $service)
    {
        $this->service = $service;
    }

    public function findByCompany($companyId)
    {
        try {
            $result = $this->service->findByCompany($companyId);
        }catch (\Exception $e){
            return ApiResponse::error($e,"Ocorreu as configurações de pedido");
        }

        return ApiResponse::success($result, "Configurações de pedido");
    }

    public function changeOpeningStatus($companyId,Request $request)
    {
        try {
            $result = $this->service->changeOpeningStatus($companyId,$request->all());
        }catch (\Exception $e){
            return ApiResponse::error($e,"Ocorreu as configurações de pedido");
        }

        return ApiResponse::success($result, "Configurações de pedido");
    }
}
