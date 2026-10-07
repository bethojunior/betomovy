<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Balance\CreditPrepaidRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Balance\CreditPrepaid;
use App\Services\Balance\CreditPrepaidService;
use Illuminate\Http\Request;

class CreditPrepaidController extends Controller
{
    /**
     * @var CreditPrepaidService
     */
    private $service;

    public function __construct(CreditPrepaidService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar crédito pré-pago");
        }

        return ApiResponse::success($result);
    }

    public function insert(CreditPrepaidRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir crédito pré-pago");
        }

        return ApiResponse::success($result);
    }

    public function update(CreditPrepaidRequest $request, CreditPrepaid $creditPrepaid)
    {
        try {
            $result = $this->service
                ->update($creditPrepaid, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar crédito pré-pago");
        }

        return ApiResponse::success($result);
    }

    public function delete(CreditPrepaid $creditPrepaid)
    {
        try {
            $result = $this->service
                ->delete($creditPrepaid);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir crédito pré-pago");
        }

        return ApiResponse::success($result);
    }
}
