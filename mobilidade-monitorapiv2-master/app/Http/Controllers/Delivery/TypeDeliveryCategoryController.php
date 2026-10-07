<?php


namespace App\Http\Controllers\Delivery;


use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\TypeDeliveryCategoryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Delivery\TypeDeliveryCategory;
use App\Services\Delivery\TypeDeliveryCategoryService;

class TypeDeliveryCategoryController extends Controller
{
    private $service;

    public function __construct(TypeDeliveryCategoryService $service)
    {
        $this->service = $service;
    }

    public function insert(TypeDeliveryCategoryRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir nova categoria");
        }

        return ApiResponse::success($result);
    }

    public function list()
    {
        try {
            $result = $this->service
                ->list();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar categorias");
        }

        return ApiResponse::success($result);

    }

    public function update(TypeDeliveryCategory $typeDeliveryCategory,TypeDeliveryCategoryRequest $request)
    {
        try {
            $result = $this->service
                ->update($typeDeliveryCategory,$request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar categoria");
        }

        return ApiResponse::success($result);
    }

    public function delete(TypeDeliveryCategory $typeDeliveryCategory)
    {
        try {
            $result = $this->service
                ->delete($typeDeliveryCategory);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir categoria");
        }

        return ApiResponse::success($result);
    }
}
