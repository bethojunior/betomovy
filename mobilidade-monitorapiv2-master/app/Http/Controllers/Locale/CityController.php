<?php

namespace App\Http\Controllers\Locale;

use App\Http\Requests\Config\CityMirroringRequest;
use App\Http\Requests\Locale\CityRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Locale\City;
use App\Services\Config\CityMirroringService;
use App\Services\Locale\CityService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CityController extends Controller
{
    /**
     * @var CityService
     */
    private $service;

    public function __construct(CityService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        $query = $request->query->get('q');
        $estateId = $request->query->get('estateId');
        $isUpdatePJ = $request->query->get('isUpdatePJ');

        try {
            $cities = $this->service->all($query, $estateId, $isUpdatePJ);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar cidades");
        }

        return ApiResponse::success($cities, "Cidades encontradas");
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

    public function store(CityRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(City $city, CityRequest $request)
    {
        try {
            $data = $this->service->update($city, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function delete(City $city)
    {
        try {
            $data = $this->service->delete($city);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function actives(Request $request)
    {
        try {
            $result = $this->service
                ->findActives();
        } catch (\Exception $e) {
            return ApiResponse::error(
                $e->getMessage(),
                "Erro ao buscar cidades ativas"
            );
        }

        return ApiResponse::success($result, "Cidades ativas encontradas");
    }

    public function activesFully()
    {
        try {
            $result = $this->service
                ->findActivesFully();
        } catch (\Exception $e) {
            return ApiResponse::error(
                $e->getMessage(),
                "Erro ao buscar cidades ativas"
            );
        }

        return ApiResponse::success($result, "Cidades ativas encontradas");
    }

    public function mirror(Request $request, CityMirroringService $service)
    {
        try {
            $result = $service
                ->mirror($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error(
                $e->getMessage(),
                "Erro ao buscar espelhar cidade"
            );
        }

        return ApiResponse::success($result, "Cidade espelhada com sucesso");
    }

    public function editCityShortName(int $id, Request $request)
    {
        try {
            $result = $this->service->editCityShortName($id, $request->input('shortName'));
        } catch (\Exception $e) {
            return ApiResponse::error(
                $e->getMessage()
            );
        }

        return ApiResponse::success($result, "Atualizado com sucesso");
    }

    public function getTripTypes(int $cityId)
    {
        return ApiResponse::success($this->service->getTripTypes($cityId));
    }

    public function deleteCityName(int $id)
    {
        try {
            $data = $this->service->deleteCityName($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function allLocale(Request $request)
    {
        $query = $request->query->get('q');
        $estateId = $request->query->get('estateId');

        try {
            $cities = $this->service->allLocale($query, $estateId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar cidades");
        }

        return ApiResponse::success($cities, "Cidades encontradas");
    }

}
