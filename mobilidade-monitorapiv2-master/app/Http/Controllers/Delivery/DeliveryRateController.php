<?php


namespace App\Http\Controllers\Delivery;


use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\DeliveryRateRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryRateService;
use Illuminate\Http\Request;

class DeliveryRateController extends Controller
{
    private $service;

    public function __construct(DeliveryRateService $service)
    {
        $this->service = $service;
    }

    public function insert(DeliveryRateRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir taxa");
        }

        return ApiResponse::created($result);
    }

    public function getAll(Request $request)
    {
        try {
            $results = $this->service
                ->getAll($request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar taxas");
        }

        return ApiResponse::created($results);
    }

    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir taxa");
        }

        return ApiResponse::success(null,"Taxa excluida com sucesso");
    }
}
