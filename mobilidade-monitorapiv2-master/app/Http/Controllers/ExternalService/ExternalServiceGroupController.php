<?php


namespace App\Http\Controllers\ExternalService;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\ExternalService\ExternalServiceGroupRepository;

class ExternalServiceGroupController extends Controller
{
    private $repository;

    public function __construct(ExternalServiceGroupRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $data = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao listar grupos de serviços externos');
        }

        return ApiResponse::success($data);
    }
}
