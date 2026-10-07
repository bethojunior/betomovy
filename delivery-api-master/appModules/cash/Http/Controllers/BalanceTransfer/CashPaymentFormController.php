<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 15:46
 */

namespace Cash\Http\Controllers\BalanceTransfer;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Cash\Repositories\BalanceTransfer\CashPaymentFormRepository;

class CashPaymentFormController extends Controller
{
    /**
     * @var CashPaymentFormRepository
     */
    private $repository;

    public function __construct(CashPaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar formas de pagamento");
        }

        return ApiResponse::success($result);
    }
}
