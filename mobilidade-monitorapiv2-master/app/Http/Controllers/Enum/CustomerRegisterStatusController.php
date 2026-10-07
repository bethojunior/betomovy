<?php

namespace App\Http\Controllers\Enum;

use App\Http\Responses\ApiResponse;
use App\Repositories\Enum\CustomerRegisterStatusRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CustomerRegisterStatusController extends Controller
{
    /**
     * @var CustomerRegisterStatusRepository
     */
    private $repository;

    public function __construct(CustomerRegisterStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar os status de clientes');
        }

        return ApiResponse::success($result);
    }
}
