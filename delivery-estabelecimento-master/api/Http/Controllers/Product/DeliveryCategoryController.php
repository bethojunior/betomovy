<?php

namespace Api\Http\Controllers\Product;

use Api\Http\Responses\ApiResponse;
use Api\Services\Product\DeliveryCategoryService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeliveryCategoryController extends Controller
{
    private $service;

    public function __construct(DeliveryCategoryService $service)
    {
        $this->service = $service;
    }

    public function updatePosition(Request $request)
    {
        try {
            $this->service->updatePosition($request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error(null, "Ocorreu um erro ao tentar atualizar posições");
        }

        return ApiResponse::success(null, "Atualização feita com sucesso");
    }
}
