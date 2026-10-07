<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/07/2020
 * Time: 17:03
 */

namespace Cash\Http\Controllers\BalanceTransfer;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Cash\Http\Requests\BalanceTransfer\BalanceTransferRequest;
use Cash\Services\BalanceTransfer\BalanceTransferService;
use Illuminate\Http\Request;

class BalanceTransferController extends Controller
{
    /**
     * @var BalanceTransferService
     */
    private $service;

    public function __construct(BalanceTransferService $service)
    {
        $this->service = $service;
    }

    public function transfer(BalanceTransferRequest $request)
    {
        try {
            $result = $this->service
                ->transfer($request->validated(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao fazer transferência");
        }

        return ApiResponse::created($result);
    }

    public function find($id)
    {
        try {
            $result = $this->service->findOne($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar dados da transferência");
        }

        return ApiResponse::success($result);
    }

    public function financialStatement(Request $request)
    {
        try {
            $result = $this->service
                ->financialStatement($request->user(), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar extrato");
        }

        return ApiResponse::success($result);
    }
}
