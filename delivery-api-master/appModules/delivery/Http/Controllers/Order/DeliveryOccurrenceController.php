<?php


namespace Delivery\Http\Controllers\Order;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Order\DeliveryOccurrenceRequest;
use Delivery\Services\Order\DeliveryOccurrenceService;

class DeliveryOccurrenceController extends Controller
{
    private $service;

    public function __construct(DeliveryOccurrenceService $service)
    {
        $this->service = $service;
    }

    public function store(DeliveryOccurrenceRequest $request)
    {
        try{
            $result = $this->service->store($request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro ao inserir ocorrência");
        }

        return ApiResponse::success($result, "Ocorrência inserida com sucesso");
    }
}
