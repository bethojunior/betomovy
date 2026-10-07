<?php

namespace App\Http\Controllers\User;

use App\Http\Requests\Config\ChangeConfirmationCodeRequest;
use App\Http\Requests\User\RequiredFieldRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\RequiredFieldService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RequiredFieldController extends Controller
{
    /**
     * @var RequiredFieldService
     */
    private $service;

    public function __construct(RequiredFieldService $service)
    {
        $this->service = $service;
    }

    public function findByUserType($userTypeId)
    {
        try {
            $result = $this->service
                ->findByUserTypeId($userTypeId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os campos obrigatórios");
        }

        return ApiResponse::success($result);
    }

    public function findFromCustomer()
    {
        try {
            $result = $this->service->findToCustomer();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar os campos obrigatórios do cliente');
        }

        return ApiResponse::success($result);
    }

    public function update($requiredFieldId, RequiredFieldRequest $request)
    {
        try {
            $result = $this->service
                ->update($requiredFieldId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao atualizar campo obrigatório');
        }

        return ApiResponse::success($result);
    }

    public function changeConfirmationCode(ChangeConfirmationCodeRequest $request)
    {
        try {
            $result = $this->service->changeConfirmationCode($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao atualizar códigos de confirmação');
        }

        return ApiResponse::success($result);
    }

    public function getTypeConfirmationCodeCustomer()
    {
        try {
            $results = $this->service->getTypeConfirmationCodeCustomer();
        }catch (\Exception $e){
            return ApiResponse::error($e, 'Erro ao obter tipos de código confirmação');
        }

        return ApiResponse::success($results);
    }
}
