<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\User\BlockReasonsTypeRepository;
use Illuminate\Http\Request;

class BlockReasonsTypeController extends Controller
{
    /**
     * @var BlockReasonsTypeRepository
     */
    private $repository;

    public function __construct(BlockReasonsTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar motivos de bloqueio");
        }

        return ApiResponse::success($result);
    }
}
