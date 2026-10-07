<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Requests\Company\CompanyAddressRequest;
use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyAddressService;
use Illuminate\Routing\Controller;

class CompanyAddressController extends Controller
{
    private $service;

    public function __construct(CompanyAddressService $service)
    {
        $this->service = $service;
    }

    public function findActive($companyId)
    {
        try {
            $result = $this->service->findActive($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao buscar endereço");
        }

        return ApiResponse::success($result);
    }

    public function store(CompanyAddressRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (\Exception $e) {

            return ApiResponse::error($e, "Erro ao inserir endereço");
        }

        return ApiResponse::created($result);
    }

}
