<?php

namespace App\Http\Controllers\Balance;

use App\Http\Responses\ApiResponse;
use App\Services\Balance\BalanceService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Balance\InsertBalanceCustomerRequest;
use App\Http\Requests\Balance\InsertBalanceDriverRequest;

class BalanceController extends Controller
{
    private $service;

    public function __construct(BalanceService $service)
    {
        $this->service = $service;
    }

    public function manageBalance(int $id, InsertBalanceCustomerRequest $request)
    {
        try {
            $userId = (int) ($request->header('userid') ?? $request->header('userId') ?? optional($request->user())->idUser ?? 0);
            $result = $this->service->manageBalanceAction($id, $request->validated(), $userId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao modificar o saldo');
        }

        return ApiResponse::success($result, 'Saldo modificado com sucesso');
    }

    public function insertBalanceDriver(int $id, InsertBalanceDriverRequest $request)
    {
        try {
            $userId = (int) ($request->header('userid') ?? $request->header('userId') ?? optional($request->user())->idUser ?? 0);
            $result = $this->service->insertBalanceDriver($id, $request->validated(), $userId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao modificar o saldo do motorista');
        }

        return ApiResponse::success($result, 'Saldo do motorista modificado com sucesso');
    }
}
