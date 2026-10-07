<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryConfigAdminService;
use Illuminate\Http\Request;

class DeliveryConfigAdminController
{
    public function __construct(DeliveryConfigAdminService $service)
    {
        $this->service = $service;
    }

    public function list() {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro ao buscar as configurações do delivery admin");
        }

        return ApiResponse::success($result,"Configurações encontradas com sucesso!");
    }

    public function edit(Request $request) {
        try {
            $result = $this->service->insert($request);
        }  catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro ao editar as informações do delivery admin");
        }

        return ApiResponse::success($result,"Configurações editadas com sucesso!");
    }

}
