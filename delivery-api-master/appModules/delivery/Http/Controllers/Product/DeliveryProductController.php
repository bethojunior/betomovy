<?php

namespace Delivery\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Models\Product\DeliveryProduct;
use Delivery\Services\Product\DeliveryProductService;

class DeliveryProductController extends Controller
{
    /**
     * @var DeliveryProductService
     */
    private $service;

    public function __construct(DeliveryProductService $service)
    {
        $this->service = $service;
    }

    public function findByCategory($companyId)
    {
        try {
            $result = $this->service
                ->findByCategoriesAndCompany($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar produtos");
        }

        return ApiResponse::success($result);
    }

    public function find(DeliveryProduct $deliveryProduct)
    {
        try {
            $result = $this->service
                ->find($deliveryProduct);
        } catch (\Exception $e) {
            return ApiResponse::error($e,"Erro ao buscar produto");
        }

        return ApiResponse::success($result);
    }
}
