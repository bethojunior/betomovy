<?php

namespace Cash\Http\Controllers\Sale;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Cash\Repositories\Sale\SalePaymentFormRepository;
use Illuminate\Http\Request;

class SalePaymentFormController extends Controller
{
    /**
     * @var SalePaymentFormRepository
     */
    private $repository;

    public function __construct(SalePaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as formas de pagamento");
        }

        return ApiResponse::success($result);
    }
}
