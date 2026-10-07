<?php

namespace App\Http\Controllers\Driver;

use App\Contracts\Exception\CustomException;
use App\Http\Requests\Driver\Balance\UpdateDriverBalanceRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\UpdateDriverBalanceService;
use App\Http\Controllers\Controller;

class DriverBalanceController extends Controller
{
    public function update(UpdateDriverBalanceRequest $request, UpdateDriverBalanceService $service)
    {
        try {
            $result = $service->update($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e,
                $e instanceof CustomException ?
                    $e->getMessage() : "Erro ao alterar saldo"
            , 400, true);
        }

        return ApiResponse::success($result, 'Saldo(s) alterados com sucesso');
    }
}
