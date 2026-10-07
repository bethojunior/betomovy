<?php


namespace Delivery\Http\Controllers\Order;


use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Order\EvaluateDeliveryRequest;
use Delivery\Services\Order\DeliveryRatingService;
use Illuminate\Routing\Controller;

class DeliveryRatingController extends Controller
{
    private $service;

    public function __construct(DeliveryRatingService $service)
    {
        $this->service = $service;
    }

    public function evaluate(EvaluateDeliveryRequest $request)
    {
        try {
            $result = $this->service->evaluate($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao avaliar entrega");
        }

        return ApiResponse::success($result);
    }
}
