<?php

namespace Cash\Http\Controllers\Sale;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Cash\Repositories\Sale\SaleStatusRepository;
use Illuminate\Http\Request;

class SaleStatusController extends Controller
{
    /**
     * @var SaleStatusRepository
     */
    private $repository;

    public function __construct(SaleStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os status de venda");
        }

        return ApiResponse::success($result);
    }
}
