<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Requests\Delivery\DeliverySectionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliverySectionService;
use Illuminate\Http\Request;

class DeliverySectionController
{
    private $service;

    public function __construct(DeliverySectionService $service)
    {
        $this->service = $service;
    }

    public function store(DeliverySectionRequest $request)
    {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::created($result, "Seção cadastrada com sucesso");
    }

    public function findAll()
    {
        try {
            $results = $this->service->findAll();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($results, "Listagem de seções");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::created(null, "Seção deletada com sucesso");
    }

    public function update($id, Request $request)
    {
        try {
            $result = $this->service->update($id,$request->all());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($result, "Seção atualizada com sucesso");
    }
}
