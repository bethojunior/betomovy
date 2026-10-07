<?php

namespace App\Http\Controllers\Military;

use App\Http\Responses\ApiResponse;
use App\Repositories\Military\MilitaryStatusRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MilitaryStatusController extends Controller
{
    /**
     * @var MilitaryStatusRepository
     */
    private $repository;

    public function __construct(MilitaryStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os status de força militar");
        }

        return ApiResponse::success($result);
    }
}
