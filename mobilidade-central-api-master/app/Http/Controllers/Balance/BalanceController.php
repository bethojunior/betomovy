<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Balance\BalanceService;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function __construct(BalanceService $service)
    {
        $this->service = $service;
    }

    public function find($id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar balance');
        }

        return ApiResponse::success($result, 'Balance Encontrada');
    }
}
