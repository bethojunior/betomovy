<?php


namespace App\Http\Controllers\Delivery;


use App\Http\Requests\Delivery\PayMachineReturnRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\PayMachineReturnService;

class PayMachineReturnController
{
    private $service;

    public function __construct(PayMachineReturnService $service)
    {
        $this->service = $service;
    }

    public function store(PayMachineReturnRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir taxa de devolução da maquineta");
        }

        return ApiResponse::success($result);
    }

    public function getActive($cityId)
    {
        try {
            $result = $this->service->getActive($cityId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar taxa devolução da maquineta");
        }

        return ApiResponse::success($result);
    }
}
