<?php


namespace App\Http\Controllers\Establishment;


use App\Http\Controllers\Controller;
use App\Http\Requests\Establishment\EstablishmentCollectionManagementRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Establishment\EstablishmentCollectionManagementService;

class EstablishmentCollectionManagementController extends Controller
{
    private $service;

    public function __construct(EstablishmentCollectionManagementService $service)
    {
        $this->service = $service;
    }


    public function findAll()
    {
        try {
            $data = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
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

    public function getCompaniesById(int $id)
    {
        try {
            $data = $this->service->getCompaniesById($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function save(EstablishmentCollectionManagementRequest $request)
    {
        try {
            $data = $this->service->save($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function delete(int $id)
    {
        try {
            $data = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
