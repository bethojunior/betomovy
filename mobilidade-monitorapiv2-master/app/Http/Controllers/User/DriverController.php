<?php

namespace App\Http\Controllers\User;

use App\Constants\Users\UserTypeConst;
use App\Http\Requests\Driver\UpdateDriverRequest;
use App\Http\Responses\ApiResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User\Driver;
use App\Services\Driver\DriverBankAccountPolicy;
use App\Services\Driver\DriverLocationService;
use App\Services\ExternalService\ExternalServiceService;
use App\Services\Role\RoleUserPermissionService;
use App\Services\User\DriverService;
use App\Utils\InfoSimples;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Jobs\RequestDriverDocumentsAndPhotoJob;
use App\Utils\GoogleMapsApi;

class DriverController extends Controller
{
    /**
     * @var DriverService
     */
    private $service;
    private $externalServiceService;
    private $mapsApi;
    private $permissionService;


    public function __construct(
        DriverService $service,
        ExternalServiceService $externalServiceService,
        GoogleMapsApi $mapsApi,
        RoleUserPermissionService $permissionService)
    {
        $this->service = $service;
        $this->externalServiceService = $externalServiceService;
        $this->mapsApi = $mapsApi;
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

    public function findAllDelivery(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAllDelivery($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function edit(Driver $driver, UpdateDriverRequest $request)
    {
        try {
            $result = $this->service
                ->edit($driver, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao editar motorista");
        }

        return ApiResponse::success($result);
    }

    public function show($driverId, DriverBankAccountPolicy $bankAccountPolicy)
    {

        try {
            $driver = $this->service
                ->find($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao motorista");
        }

        return ApiResponse::success($bankAccountPolicy->restrict($driver, Auth::user()));
    }

    public function position($id)
    {
        try {
            $driver_position = $this->service
                ->findPosition($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar localização do motorista");
        }

        return ApiResponse::success($driver_position, "Localização do motorista encontrada");
    }

    public function lastPositions($driverId, Request $request, DriverLocationService $service)
    {
        try {
            $result = $service->findByDriver($driverId, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar");
        }

        return ApiResponse::success($result);
    }

    public function stations($driverId)
    {
        try {
            $stations = $this->service->getStationsByDriver($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar estações do motorista");
        }

        return ApiResponse::success($stations);
    }

    public function changeDriversPrepaid(Request $request)
    {
        try {
            $result = $this->service
                ->updateDriversPrepaid($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar o status de pré-pago de todos os motoristas");
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

    public function resetAllBalance(Request $request): JsonResponse
    {
        try {
            $result = $this->service->resetAllBalance($request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao zerar saldos dos motoristas");
        }

        return ApiResponse::success($result);
    }

    public function resetBalance(Driver $driver)
    {
        try {
            $result = $this->service->resetBalance($driver);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao zerar saldo do motorista");
        }

        return ApiResponse::success($result);
    }

    public function resetRating(Request $request, int $id = null): JsonResponse
    {
        try {
            $result = $this->service->resetRating($id, $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao zerar nota do motorista");
        }

        return ApiResponse::success($result);
    }


    public function criminalRecord(int $id, Request $request)
    {

        try {
            $driver = $this->service
                ->find($id);

            $externalService = $this->externalServiceService->findAllTypeCriminalRecordByCity($request->header('cityid'), $request->query->all())->first();
            $infoSimples = new InfoSimples($externalService->externalServiceMetaData->first()->value);

            $params = array(
                "nome" => $driver->name,
                "cpf" => onlyCharacters($driver->document),
                "birthdate" => $request->dateOfBirth,
            );

            return ApiResponse::success($infoSimples->criminalRecord($params));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }
    }


    //NOVA IMPLEMENTAÇÃO GET ALL DRIVERS // DOOUG //
    public function getAll(Request $request)
    {
        try {
            $data = $this->service->getAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function getBoletos()
    {
        try {
            $data = $this->mapsApi->getUserAsaas();
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function positions(Request $request): JsonResponse
    {
        try {
            $data = $this->service->getAllDriversWithPositions($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function activateRegister(Driver $driver): JsonResponse
    {
        return ApiResponse::success($this->service->activateRegister($driver));
    }

    public function delete($id)
    {
        try {
            $result = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir motorista");
        }

        return ApiResponse::success($result, "Motorista excluído com sucesso");
    }

    public function listSelect2(Request $request)
    {
        try {
            $result = $this->service
                ->listBySelect2($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os motoristas");
        }

        return ApiResponse::success($result);
    }

    public function findAllWithoutPage(Request $request)
    {
        try {
            $data = $this->service->findAllWithoutPage($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function requestDocumentAndPhoto(Request $request) {
        $validated = $request->validate([
            'users'     => 'required|array|min:1',
            'type'      => 'required|array|min:1',
            'block'     => 'boolean',
            'isByGroup' => 'boolean',
        ]);

        RequestDriverDocumentsAndPhotoJob::dispatch($validated);

        return ApiResponse::success([
        'status'  => true,
        'message' => 'Processamento iniciado em background'
        ]);
    }
    public function insertLimitHours(Request $request)
    {
        try {
            $data = $this->service->insertLimitHours($request->driverId, $request->limitHours);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }
        return ApiResponse::success($data);
    }


    public function findOne($driverId)
    {
        try {
            $data = $this->service->findOne($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function validateRegistration(int $driverId)
    {
        $authUser = Auth::user();
        $isAdmin = $authUser && optional($authUser->userType)->idUserType === UserTypeConst::ADMIN;

        if (!$isAdmin || !$this->permissionService->hasPermission($authUser, 'zafira', 'validar_cadastro')) {
            return ApiResponse::error(null, 'Sem permissão para validar cadastro.', 403);
        }

        try {
            $data = $this->service->validateRegistration($driverId);
            return ApiResponse::success($data, $data['message'] ?? 'Sucesso');
        } catch (\Exception $e) {
            return ApiResponse::error($e, $e->getMessage() ?: 'Erro ao validar cadastro');
        }
    }

}
