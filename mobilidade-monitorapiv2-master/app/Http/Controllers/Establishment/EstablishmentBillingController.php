<?php


namespace App\Http\Controllers\Establishment;


use App\Http\Controllers\Controller;
use App\Http\Requests\Establishment\EstablishmentBillingRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Establishment\EstablishmentBillingService;
use Illuminate\Http\Request;

class EstablishmentBillingController extends Controller
{
    private $service;

    public function __construct(EstablishmentBillingService $service)
    {
        $this->service = $service;
    }

    public function create(EstablishmentBillingRequest $request)
    {
        try {
            $establishmentBilling = $this->service
                ->create($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao criar cobrança");
        }

        return ApiResponse::success($establishmentBilling, "Cobrança para estabelecimento criada");
    }

    public function findAll(Request $request)
    {
        try {
            $results = $this->service
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao listar cobranças");
        }

        return ApiResponse::success($results, "Lista de cobranças");
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->deleteById($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao excluir cobrança");
        }

        return ApiResponse::success($result, "Cobrança excluida");
    }

    public function confirmPayment($id)
    {
        try {
            $result = $this->service
                ->confirmPayment($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao confirmar cobrança");
        }

        return ApiResponse::success($result, "Cobrança confirmada");
    }


    public function refusePayment($id)
    {
        try {
            $result = $this->service
                ->refusePayment($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao recusar cobrança");
        }

        return ApiResponse::success($result, "Cobrança recusando");
    }
}
