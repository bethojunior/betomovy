<?php


namespace Delivery\Http\Controllers\Promotion;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Promotion\UserDiscountCouponDeliveryRequest;
use Delivery\Services\Promotion\UserDiscountCouponDeliveryService;

class UserDiscountCouponDeliveryController extends Controller
{
    private $service;

    public function __construct(UserDiscountCouponDeliveryService $service)
    {
        $this->service = $service;
    }

    public function insert(UserDiscountCouponDeliveryRequest $request)
    {
        try {
            $result = $this->service->insert($request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao inserir cupom");
        }

        return ApiResponse::success($result, "Cupom inserido com sucesso");
    }

    public function findAll($userId)
    {
        try {
            $result = $this->service->findAll($userId);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao buscar os cupons");
        }

        return ApiResponse::success($result, "Lista de cupons");
    }


    public function findAllCompany($userId, $companyId)
    {
        try {
            $result = $this->service->findAllCompany($userId, $companyId);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao buscar os cupons");
        }

        return ApiResponse::success($result, "Lista de cupons");
    }
}
