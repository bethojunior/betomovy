<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Repositories\User\PendencyField\PendencyFieldTypeRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PendencyFieldTypeController extends Controller
{
    /**
     * @var PendencyFieldTypeRepository
     */
    private $repository;

    public function __construct(PendencyFieldTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de pendencias");
        }

        return ApiResponse::success($result);
    }
}
