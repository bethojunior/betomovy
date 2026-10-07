<?php


namespace Api\Http\Controllers\Establishment;

use Api\Http\Responses\ApiResponse;
use Api\Services\Establishment\EstablishmentBillingService;
use App\Http\Controllers\Controller;
use Common\Models\Establishment\EstablishmentBilling;

class EstablishmentBillingController extends Controller
{
    private $service;

    public function __construct(EstablishmentBillingService $service)
    {
        $this->service = $service;
    }

    public function findByCompany($companyId)
    {
        try {
            $results = $this->service->findByCompany($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($results, "Lista de cobranças");
    }

    public function createCustomerInAsaas()
    {
        try {
            $result = $this->service->createCustomerInAsaas();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result, "Cliente cadastrado no asaas");
    }

    public function createBillet(EstablishmentBilling $establishmentBilling)
    {
        try {
            $result = $this->service->createBillet($establishmentBilling);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result, "Boleto gerado com sucesso");
    }
}
