<?php

namespace App\Http\Controllers\Report\Trip;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Trip\FinancialDetailOfTripService;
use Illuminate\Http\Request;

class FinancialDetailOfTripController extends Controller
{
    /**
     * @var FinancialDetailOfTripService
     */
    private $service;

    public function __construct(FinancialDetailOfTripService $service)
    {
        $this->service = $service;
    }

    public function __invoke(Request $request)
    {
        try {
            $result = $this->service
                ->getAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar detalhes financeiros de viagem.');
        }

        return ApiResponse::success($result);
    }
}
