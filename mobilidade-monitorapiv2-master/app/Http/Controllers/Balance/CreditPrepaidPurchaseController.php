<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Balance\CreditPrepaidPurchase;
use App\Services\Balance\CreditPrepaidPurchaseService;
use Illuminate\Http\Request;

class CreditPrepaidPurchaseController extends Controller
{
    /**
     * @var CreditPrepaidPurchaseService
     */
    private $service;

    public function __construct(CreditPrepaidPurchaseService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar compras de crédito prepago");
        }

        return ApiResponse::success($result);
    }

    public function findByCityId($cityId, Request $request)
    {
        try {
            $request['cityId'] = $cityId;
            $result = $this->service->findByCityId($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar compras de crédito prepago");
        }

        return ApiResponse::success($result);
    }

    public function credit(CreditPrepaidPurchase $creditPrepaidPurchase)
    {
        try {
            $result = $this->service
                ->credit($creditPrepaidPurchase);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao creditar compra de crédito");
        }

        return ApiResponse::success($result);
    }

    public function refuse(CreditPrepaidPurchase $creditPrepaidPurchase)
    {
        try {
            $result = $this->service
                ->refuse($creditPrepaidPurchase);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao recusar compra de crédito");
        }

        return ApiResponse::success($result);
    }
}
