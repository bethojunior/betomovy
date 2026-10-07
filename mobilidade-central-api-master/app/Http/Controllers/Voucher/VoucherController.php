<?php

namespace App\Http\Controllers\Voucher;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Voucher\VoucherService;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function __construct(VoucherService $service)
    {
        $this->service = $service;
    }

    public function buyWithCard(Request $request){
        try {
            $result = $this->service
                ->doPayment($request);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Ocorreu um erro ao efetuar o pagamento');
        }

        return ApiResponse::success($result, 'Compra de voucher efetuada com sucesso!');
    }

    public function generateChargePix(Request $request){
        try {
            $result = $this->service
                ->validateCharge($request);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Ocorreu um erro ao efetuar o pagamento');
        }

        return ApiResponse::success($result, 'Cobrança gerada com sucesso!');
    }
}
