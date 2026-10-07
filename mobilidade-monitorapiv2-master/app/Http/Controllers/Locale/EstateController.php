<?php

namespace App\Http\Controllers\Locale;

use App\Http\Requests\Locale\EstateRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Locale\Estate;
use App\Services\Locale\EstateService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EstateController extends Controller
{
    /**
     * @var EstateService
     */
    private $service;

    public function __construct(EstateService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        $query = $request->query->get('q');
        try {
            $estates = $this->service->all($query);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar os estados");
        }

        return ApiResponse::success($estates, "Estados encontrados");
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

    public function store(EstateRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(int $id, EstateRequest $request)
    {
        try {
            $data = $this->service->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
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

    public function getEstatesByCountryId(int $id)
    {
        try {
            $data = $this->service->getEstatesByCountryId($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
