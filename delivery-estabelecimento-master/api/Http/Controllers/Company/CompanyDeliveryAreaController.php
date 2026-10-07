<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Requests\Company\CompanyDeliveryAreaRequest;
use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyDeliveryAreaService;
use Illuminate\Routing\Controller;

class CompanyDeliveryAreaController extends Controller
{
    protected $service;

    public function __construct(CompanyDeliveryAreaService $service)
    {
        $this->service = $service;
    }

    public function store(CompanyDeliveryAreaRequest $request)
    {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result, "Área cadastrada com sucesso");
    }

    public function findAll($companyId)
    {
        try {
            $result = $this->service->findAll($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }
    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success(null,"Área excluida com sucesso!");
    }
}
