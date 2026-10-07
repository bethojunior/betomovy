<?php


namespace Api\Http\Controllers\Product;


use Api\Http\Responses\ApiResponse;
use Api\Services\Product\DeliveryProductService;
use App\Http\Controllers\Controller;
use Common\Models\Order\DeliveryProduct;
use Illuminate\Http\Request;

class DeliveryProductController extends Controller
{
    private $service;

    public function __construct(DeliveryProductService $service)
    {
        $this->service = $service;
    }

    public function changeActive(DeliveryProduct $deliveryProduct, Request $request)
    {
        try {
            $result = $this->service->changeActive($request->all(), $deliveryProduct);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao alterar status");
        }

        return ApiResponse::success($result, "Status do produto alterado");
    }

    public function updatePosition(Request $request)
    {
        try {
            $this->service->updatePosition($request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao alterar posicões");
        }

        return ApiResponse::success(null, "Posições alterada com sucesso");
    }
}
