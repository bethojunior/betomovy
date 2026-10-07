<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\DeliveryPaymentFormRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Delivery\DeliveryPaymentForm;
use App\Services\Delivery\DeliveryPaymentFormService;
use Illuminate\Http\Request;

class DeliveryPaymentFormController extends Controller
{
    /**
     * @var DeliveryPaymentFormService
     */
    private $service;

    public function __construct(DeliveryPaymentFormService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar formas de pagamento de delivery");
        }

        return ApiResponse::success($result);
    }

    public function insert(DeliveryPaymentFormRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir forma de pagamento de delivery");
        }

        return ApiResponse::created($result);
    }

    public function update(DeliveryPaymentForm $deliveryPaymentForm, DeliveryPaymentFormRequest $request)
    {
        try {
            $result = $this->service
                ->update($deliveryPaymentForm, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar forma de pagamento de delivery");
        }

        return ApiResponse::success($result);
    }

    public function delete(DeliveryPaymentForm $deliveryPaymentForm)
    {
        try {
            $result = $this->service
                ->delete($deliveryPaymentForm);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir forma de pagamento");
        }

        return ApiResponse::success($result);
    }
}
