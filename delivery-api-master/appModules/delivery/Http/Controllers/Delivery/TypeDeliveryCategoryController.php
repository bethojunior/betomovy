<?php

namespace delivery\Http\Controllers\Delivery;

use App\Http\Responses\ApiResponse;
use Delivery\Services\Delivery\TypeDeliveryCategoryService;

class TypeDeliveryCategoryController
{
    private $service;

    public function __construct(TypeDeliveryCategoryService  $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $results = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um ao tentar listar categorias");
        }

        return ApiResponse::success($results);
    }
}
