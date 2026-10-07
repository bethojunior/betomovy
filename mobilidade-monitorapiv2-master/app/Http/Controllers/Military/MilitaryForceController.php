<?php

namespace App\Http\Controllers\Military;

use App\Http\Requests\Military\MilitaryForceRequest;
use App\Http\Responses\ApiResponse;
use App\Repositories\Military\MilitaryForceRepository;
use App\Services\Military\MilitaryForceService;
use App\Http\Controllers\Controller;

class MilitaryForceController extends Controller
{
    /**
     * @var MilitaryForceRepository
     */
    private $repository;
    private $service;

    public function __construct(MilitaryForceRepository $repository, MilitaryForceService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function store(MilitaryForceRequest $request) {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($result);
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de militares");
        }

        return ApiResponse::success($result);
    }
}
