<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Requests\Delivery\DeliveryInfoSuggestionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryInfoSuggestionService;
use App\Http\Controllers\Controller;

class DeliveryInfoSuggestionController extends Controller
{
    /**
     * @var DeliveryInfoSuggestionService
     */
    private $service;

    public function __construct(DeliveryInfoSuggestionService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $deliveryInfo = $this->service->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar sugestões de informações de entrega");
        }

        return ApiResponse::success($deliveryInfo, "Sugestões encontradas");
    }

    public function insert(DeliveryInfoSuggestionRequest $request)
    {
        try {
            $deliveryInfoSuggestion = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir sugestões");
        }

        return ApiResponse::created($deliveryInfoSuggestion, "Sugestões (placeholder) inserido com sucesso");
    }
}
