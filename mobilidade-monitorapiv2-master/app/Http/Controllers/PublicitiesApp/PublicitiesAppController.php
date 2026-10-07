<?php

namespace App\Http\Controllers\PublicitiesApp;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicitiesApp\StorePublicitiesAppRequest;
use App\Http\Responses\ApiResponse;
use App\Services\PublicityApp\PublicityAppService;
use Exception;

class PublicitiesAppController extends Controller
{
    private PublicityAppService $publicityAppService;

    public function __construct(PublicityAppService $publicityAppService)
    {
        $this->publicityAppService = $publicityAppService;
    }
    public function store(StorePublicitiesAppRequest $request)
    {
        try {
            $validateData = $request->validated();
            $validateData['days_of_week'] = json_encode($validateData['days_of_week']);
            $publicityApp = $this->publicityAppService->insert($validateData);
                
            return ApiResponse::success($publicityApp);
        }catch(Exception $error){
            return ApiResponse::error($error, "Erro ao enviar publicidades");
        }
    }

    public function index()
    {
        try {
            $publicities = $this->publicityAppService->findAll();
            return ApiResponse::success($publicities);
        } catch (Exception $error) {
            return ApiResponse::error($error, "Erro ao buscar publicidades");
        }
    }

    public function show($id)
    {
        try {
            $publicity = $this->publicityAppService->findById($id);
            return ApiResponse::success($publicity);
        } catch (Exception $error) {
            return ApiResponse::error($error, "Erro ao buscar publicidade");
        }
    }

    public function update(StorePublicitiesAppRequest $request, $id)
    {
        try {
            $publicityApp = $this->publicityAppService->update($id, $request->validated());
            return ApiResponse::success($publicityApp);
        } catch (Exception $error) {
            return ApiResponse::error($error, "Erro ao atualizar publicidade");
        }
    }

    public function destroy($id)
    {
        try {
            $this->publicityAppService->delete($id);
            return ApiResponse::success(['message' => 'Publicidade excluída com sucesso']);
        } catch (Exception $error) {
            return ApiResponse::error($error, "Erro ao excluir publicidade");
        }
    }
}
