<?php

namespace App\Http\Controllers\Trip;

use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripCancellationCustomerFeeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripCancellationFeeController extends Controller
{
    /**
     * @var TripCancellationCustomerFeeService
     */
    private $service;

    public function __construct(TripCancellationCustomerFeeService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->getAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as taxas de cancelamento");
        }

        return ApiResponse::success($result);
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as taxas de cancelamento");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir a taxa de cancelamento");
        }

        return ApiResponse::success($result);
    }
}
