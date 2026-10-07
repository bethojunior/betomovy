<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Repositories\User\PendencyField\PendencyFieldStatusRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PendencyFieldStatusController extends Controller
{
    /**
     * @var PendencyFieldStatusRepository
     */
    private $repository;

    public function __construct(PendencyFieldStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os status de pendencias");
        }

        return ApiResponse::success($result);
    }
}
