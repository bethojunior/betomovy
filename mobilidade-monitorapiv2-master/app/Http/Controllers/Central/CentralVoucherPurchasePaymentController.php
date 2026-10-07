<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralVoucherPurchasePaymentRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralVoucherPurchasePaymentService;
use Illuminate\Http\Request;

class CentralVoucherPurchasePaymentController extends Controller
{
    public function __construct(CentralVoucherPurchasePaymentService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $data = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function updatePaymentForm(Request $request)
    {
        try {
            $data = $this->service->updatePaymentForm($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
