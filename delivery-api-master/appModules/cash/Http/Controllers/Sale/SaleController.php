<?php

namespace Cash\Http\Controllers\Sale;

use App\Http\Controllers\Controller;
use Cash\Http\Requests\Sale\CompanyPayRequest;
use Cash\Http\Requests\Sale\SalePayRequest;
use App\Http\Responses\ApiResponse;
use Cash\Services\Sale\PaySaleService;
use Cash\Services\Sale\SaleService;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    /**
     * @var SaleService
     */
    private $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function pay(SalePayRequest $request, $secondaryId, PaySaleService $service)
    {
        try {
            $result = $service
                ->pay($secondaryId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao efetuar o pagamento");
        }

        return ApiResponse::success($result);
    }

    public function payACompany(CompanyPayRequest $request, PaySaleService $service)
    {
        try {
            $result = $service->companyPay($request->validated(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao fazer pagamento");
        }

        return ApiResponse::created($result);
    }

    public function find($secondaryId)
    {
        try {
            $result = $this->saleService
                ->find($secondaryId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar venda");
        }

        return ApiResponse::success($result);
    }

    public function all(Request $request)
    {
        try {
            $result = $this->saleService
                ->findAll($request->user(), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar venda");
        }

        return ApiResponse::success($result);
    }
}
