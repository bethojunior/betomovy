<?php

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleCityRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Role\RoleCityService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleCityController extends Controller
{
    /**
     * @var RoleCityService
     */
    private $service;

    public function __construct(RoleCityService $service)
    {
        $this->service = $service;
    }

    public function insert($id, RoleCityRequest $request)
    {
        try {
            $result = $this->service
                ->insert($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro inserir cidade na regra");
        }

        return ApiResponse::created($result);
    }

    public function all($id)
    {
        try {
            $result = $this->service
                ->findAll($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cidades desse perfil");
        }

        return ApiResponse::success($result);
    }

    public function delete($id, $cityId)
    {
        try {
            $result = $this->service
                ->delete($id, $cityId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cidades desse perfil");
        }

        return ApiResponse::success($result);
    }

    public function deleteByCityId(int $cityId)
    {
        try {
            $result = $this->service->deleteByCityId($cityId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cidades desse perfil");
        }

        return ApiResponse::success($result);
    }
}
