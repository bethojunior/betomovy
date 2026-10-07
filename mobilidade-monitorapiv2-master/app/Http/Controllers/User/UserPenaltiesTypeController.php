<?php


namespace App\Http\Controllers\User;


use App\Http\Requests\User\UserPenaltiesTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User\UserPenaltiesType;
use App\Services\User\UserPenaltiesTypeService;

class UserPenaltiesTypeController
{
    private $service;

    public function __construct(UserPenaltiesTypeService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar as pendencias");
        }

        return ApiResponse::success($result);
    }

    public function update(UserPenaltiesType $userPenaltiesType, UserPenaltiesTypeRequest $request)
    {
        try {
            $result = $this->service
                ->update($userPenaltiesType, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar pendencia");
        }

        return ApiResponse::success($result);
    }
}
