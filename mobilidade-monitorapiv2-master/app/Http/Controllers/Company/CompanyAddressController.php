<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyAddressRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Company\CompanyAddress;
use App\Services\Company\CompanyAddressService;
use Illuminate\Http\Request;

class CompanyAddressController extends Controller
{
    /**
     * @var CompanyAddressService
     */
    private $service;

    public function __construct(CompanyAddressService $service)
    {
        $this->service = $service;
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

    public function index(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar endereços");
        }

        return ApiResponse::success($result);
    }

    public function delete(CompanyAddress $companyAddress)
    {
        try {
            $result = $this->service
                ->delete($companyAddress);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir endereço");
        }

        return ApiResponse::success($result);
    }

    public function markDefault(CompanyAddress $companyAddress)
    {
        try {
            $result = $this->service
                ->markDefault($companyAddress);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao marcar endereço como padrão");
        }

        return ApiResponse::success($result);
    }
}
