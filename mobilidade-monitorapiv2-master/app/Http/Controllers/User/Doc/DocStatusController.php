<?php

namespace App\Http\Controllers\User\Doc;

use App\Http\Responses\ApiResponse;
use App\Repositories\User\Doc\DocStatusRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DocStatusController extends Controller
{
    /**
     * @var DocStatusRepository
     */
    private $repository;

    public function __construct(DocStatusRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar status de documentos");
        }

        return ApiResponse::success($result);
    }
}
