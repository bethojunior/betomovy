<?php

namespace App\Http\Controllers\DiscountCoupon;

use App\Http\Requests\DiscountCoupon\DiscountCouponRequest;
use App\Http\Responses\ApiResponse;
use App\Services\DiscountCoupon\DiscountCouponService;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DiscountCouponController extends Controller
{
    /**
     * @var DiscountCouponService
     */
    private $service;

    public function __construct(DiscountCouponService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os cupons de desconto");
        }

        return ApiResponse::success($result);
    }

    public function insert(DiscountCouponRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir o cupom de desconto");
        }

        return ApiResponse::created($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar cupom");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id, 0);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desabilitar cupom");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir cupom");
        }

        return ApiResponse::success(true);
    }
}
