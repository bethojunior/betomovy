<?php

namespace App\Http\Controllers\Central;

use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralVoucherPurchasePaymentService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CentralVoucherPurchasePaymentController extends Controller
{
    private $service;

    public function __construct(CentralVoucherPurchasePaymentService $service)
    {
        $this->service = $service;
    }

    public function findAllActives()
    {
        try {
            $data = $this->service->findAllActives();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

}
