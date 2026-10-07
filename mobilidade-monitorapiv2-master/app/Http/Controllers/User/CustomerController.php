<?php

namespace App\Http\Controllers\User;

use App\Constants\Users\UserTypeConst;
use App\Http\Requests\User\CustomerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\ExternalService\ExternalServiceService;
use App\Services\Role\RoleUserPermissionService;
use App\Services\User\CustomerService;
use App\Utils\InfoSimples;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    /**
     * @var CustomerService
     */
    private $service;
    private $externalServiceService;
    private $permissionService;

    public function __construct(
        CustomerService $service,
        ExternalServiceService $externalServiceService,
        RoleUserPermissionService $permissionService
    ) {
        $this->service = $service;
        $this->externalServiceService = $externalServiceService;
        $this->permissionService = $permissionService;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function show(int $id)
    {
        try {
            $data = $this->service->show($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function edit(int $id, CustomerRequest $request)
    {
        try {
            $data = $this->service->edit($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function unlock($customerId)
    {
        try {
            $result = $this->service->unlock($customerId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao liberar cliente");
        }

        return ApiResponse::success($result);
    }

    public function exampleImport()
    {
        try {
            list($result, $title) = $this->service
                ->findExampleToImport();

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar o modelo de importação");
        }

        return ApiResponse::arrayExcel($result, false, $title);
    }

    public function findAllLocation($cityId)
    {
        try {
            $result = $this->service
                ->findAllLocation($cityId);

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar localizações");
        }

        return ApiResponse::success($result);
    }

    public function findAllCentralCustomers(Request $request)
    {
        try {
            $result = $this->service->findAllCentralCustomers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao encontrar usuários das centrais");
        }

        return ApiResponse::success($result);
    }


    public function criminalRecord(int $id, Request $request)
    {
        try {
            $user = $this->service->show($id);
            $externalService = $this->externalServiceService->findAllTypeCriminalRecordByCity($request->header('cityid'), $request->query->all())->first();
            $infoSimples = new InfoSimples($externalService->externalServiceMetaData->first()->value);


            $params = array(
                "nome" => $user->name,
                "cpf" => onlyCharacters($user->document),
                "birthdate" => $user->dateOfBirth,
            );

            return ApiResponse::success($infoSimples->criminalRecord($params));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }
    }

    // @TODO - Verificar método/feature se esta funcional
    public function block($customerId)
    {
        try {
            $result = $this->service->block($customerId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao bloquear cliente");
        }

        return ApiResponse::success($result);
    }

    public function validateRegistration(int $id)
    {
        $authUser = Auth::user();
        $isAdmin = $authUser && optional($authUser->userType)->idUserType === UserTypeConst::ADMIN;

        if (!$isAdmin || !$this->permissionService->hasPermission($authUser, 'zafira', 'validar_cadastro')) {
            return ApiResponse::error(null, 'Sem permissão para validar cadastro.', 403);
        }

        try {
            $data = $this->service->validateRegistration($id);
            return ApiResponse::success($data, $data['message'] ?? 'Sucesso');
        } catch (\Exception $e) {
            return ApiResponse::error($e, $e->getMessage() ?: 'Erro ao validar cadastro');
        }
    }

}
