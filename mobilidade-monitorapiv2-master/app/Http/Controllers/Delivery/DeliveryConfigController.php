<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Requests\Delivery\UpdateImageEstablishmentSignUpRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryConfigService;

class DeliveryConfigController
{
    protected $service;

    public function __construct(DeliveryConfigService $service)
    {
        $this->service = $service;
    }

    public function updateImageEstablishmentSignUp(UpdateImageEstablishmentSignUpRequest $request)
    {
        try {
            $this->service->updateImageEstablishmentSignUp($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar atualizar a foto");
        }

        return ApiResponse::success(null,"Imagem atualizada com sucesso!");
    }
}
