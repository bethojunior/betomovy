<?php

namespace App\Http\Controllers\Price\Dynamic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Price\Dynamic\DynamicAreaRequest;
use App\Http\Requests\Price\Dynamic\DynamicAreaUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\Dynamic\DynamicAreaService;
use Illuminate\Http\Request;

class DynamicAreaController extends Controller
{
    protected $service;

    public function __construct(DynamicAreaService $service)
    {
        $this->service = $service;
    }

    public function store(DynamicAreaRequest $request)
    {
        try {
            $dynamicArea = $this->service->store($request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar inserir dinamica");
        }

        return ApiResponse::created($dynamicArea, "Dinamica cadastrada com sucesso");
    }

    public function findByCity(Request $request)
    {
        try {
            $results = $this->service->findAllByCity($request->header('cityId'));
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar listar dinamicas");
        }

        return ApiResponse::success($results, "Lista de dinamicas");
    }

    public function update(DynamicAreaUpdateRequest $request, $id)
    {
        $validatedData = $request->validated();
    
        try {
            $dynamicArea = $this->service->update($id, $validatedData);
            $responseData = $dynamicArea->toArray();
            unset($responseData['area']);
            return ApiResponse::success($responseData, 'Dinâmica atualizada com sucesso');
        } catch (\Throwable $e) {
            return ApiResponse::error(
                $e->getMessage(),
                'Ocorreu um erro ao tentar atualizar a dinâmica'
            );
        }
    }
    
    
    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar excluir dinamicas");
        }

        return ApiResponse::success(null,"Area dinamica excluida");
    }


    public function enable($id)
    {
        try {
            $this->service->changeStatus($id, true);
        } catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar atualizar status dinamica");
        }

        return ApiResponse::success(null,"Area dinamica atualizada");
    }


    public function disable($id)
    {
        try {
            $this->service->changeStatus($id,false);
        } catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar atualizar status dinamica");
        }

        return ApiResponse::success(null,"Area dinamica atualizada");
    }
}
