<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\Config\PaymentFormRepository;
use Illuminate\Http\Request;

class PaymentFormController extends Controller
{
    /**
     * @var PaymentFormRepository
     */
    private $repository;

    public function __construct(PaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar formas de pagamento");
        }

        return ApiResponse::success($result);
    }
}
