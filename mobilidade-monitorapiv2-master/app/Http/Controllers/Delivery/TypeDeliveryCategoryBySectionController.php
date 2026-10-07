<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\TypeDeliveryCategoryBySectionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\TypeDeliveryCategoryBySectionService;

class TypeDeliveryCategoryBySectionController extends Controller
{
    private $service;

    public function __construct(TypeDeliveryCategoryBySectionService $service)
    {
        $this->service = $service;
    }

    public function store(TypeDeliveryCategoryBySectionRequest $request)
    {
        try {
            $this->service->store($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::created(null,"Categoria vinculada a seções");
    }

    public function findByTypeDeliveryCategory($typeDeliveryCategoryId)
    {
        try {
            $results = $this->service->findByTypeDeliveryCategory($typeDeliveryCategoryId);
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($results,"Listagem de seções por categoria");
    }
}
