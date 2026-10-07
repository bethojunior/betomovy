<?php

namespace App\Http\Controllers\Military;

use App\Http\Requests\Military\MilitaryForceGraduationRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Military\MilitaryForceGraduation;
use App\Repositories\Military\MilitaryForceGraduationRepository;
use App\Services\Military\MilitaryForceGraduationService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MilitaryForceGraduationController extends Controller
{
    /**
     * @var MilitaryForceGraduationRepository
     */
    private $repository;
    private $service;

    public function __construct(MilitaryForceGraduationRepository $repository, MilitaryForceGraduationService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $result = $this->repository
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as patentes");
        }

        return ApiResponse::success($result);
    }

    public function find(int $id)
    {
        try {
            $data = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function store(MilitaryForceGraduationRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(MilitaryForceGraduation $militaryForceGraduation, MilitaryForceGraduationRequest $request)
    {
        try {
            $data = $this->service->update($militaryForceGraduation, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function delete(MilitaryForceGraduation $militaryForceGraduation)
    {
        try {
            $data = $this->service->delete($militaryForceGraduation);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
