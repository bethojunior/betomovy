<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralTripInfoQuestionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralTripInfoQuestionService;

class CentralTripInfoQuestionController extends Controller
{
    private $service;

    public function __construct(CentralTripInfoQuestionService $service)
    {
        $this->service = $service;
    }

    public function store($centralId, CentralTripInfoQuestionRequest $request)
    {
        try{
            $result = $this->service->store($centralId, $request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar salvar a pergunta");
        }

        return ApiResponse::created($result, "Pergunta salva com sucesso");
    }

    public function findAll($centralId)
    {
        try{
            $result = $this->service->findAllByCentralId($centralId);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar buscar as perguntas");
        }

        return ApiResponse::created($result, "Perguntas encontradas");
    }

    public function find($centralId, $questionId)
    {
        try{
            $result = $this->service->findById($questionId);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar buscar a pergunta");
        }

        return ApiResponse::created($result, "Pergunta encontrada");
    }

    public function update($centralId, $questionId, CentralTripInfoQuestionRequest $request)
    {
        try{
            $result = $this->service->update($questionId, $request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar atualizar a pergunta");
        }

        return ApiResponse::created($result, "Pergunta atualizada com sucesso");
    }

    public function delete($centralId, $questionId)
    {
        try{
            $result = $this->service->delete($questionId);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar excluir a pergunta");
        }

        return ApiResponse::created($result, "Pergunta excluida com sucesso");
    }
}
