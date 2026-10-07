<?php


namespace App\Http\Controllers\Delivery\Acquirer;


use App\Http\Controllers\Controller;
use App\Http\Requests\Acquirer\UpdateTokenAsaasDeliveryRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Acquirer\DeliveryAcquirerMetaDataService;

class DeliveryAcquirerMetaDataController extends Controller
{
    private $service;

    public function __construct(DeliveryAcquirerMetaDataService $service)
    {
        $this->service = $service;
    }

    public function getToken()
    {
        try {
            $result = $this->service
                ->getToken();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar token");
        }

        return ApiResponse::success($result);
    }

    public function updateToken(UpdateTokenAsaasDeliveryRequest $request)
    {
        try {
            $this->service
                ->updateToken($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar token");
        }

        return ApiResponse::success(null,"Token atualizado");
    }
}
