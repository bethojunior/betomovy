<?php

namespace App\Http\Controllers\Balance;

use App\Http\Responses\ApiResponse;
use App\Services\Balance\BalanceFlowTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BalanceFlowTypeController extends Controller
{
    /**
     * @var BalanceFlowTypeService
     */
    private $service;

    public function __construct(BalanceFlowTypeService $service)
    {
        $this->service = $service;
    }

    public function findSearchable()
    {
        try {
            $result = $this->service->findSearchable();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar os tipos de lançamentos');
        }

        return ApiResponse::success($result, 'Tipos de lançamentos financeiros encontrados');
    }
}
