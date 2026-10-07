<?php

namespace App\Http\Controllers\Config;

use App\Exceptions\Config\ConfigException;
use App\Http\Requests\Config\UpdateRealtimeDatabaseRequest;
use App\Http\Requests\Config\UpdateTripTypesTextRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\ConfigService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ConfigController extends Controller
{
    /**
     * @var ConfigService
     */
    private $service;

    public function __construct(ConfigService $service)
    {
        $this->service = $service;
    }

    public function findByKey($key)
    {
        try {
            $config_value = $this->service
                ->findByKey($key);
        } catch (Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar configuração");
        }

        return ApiResponse::success($config_value, "Configuração encontrada");
    }

    public function findDeliveryConfigs()
    {
        try {
            $result = $this->service
                ->findDeliveryConfigs();

        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações de delivery");
        }

        return ApiResponse::success($result);
    }

    public function findByType(int $idConfigType)
    {
        try {
            $result = $this->service
                ->findByType($idConfigType);

        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações de delivery");
        }

        return ApiResponse::success($result);
    }

    public function updateTerms(Request $request)
    {
        try {
            $result = $this->service
                ->updateTerms($request->all());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar os termos");
        }

        return ApiResponse::success($result, "Termos atualizados");
    }

    public function updateAppSharingCustomerMessage(Request $request): JsonResponse
    {
        try {
            if (!isset($request->message)) {
                throw new Exception("Mensagem não enviada!");
            }
            $result = $this->service
                ->updateAppSharingCustomerMessage($request->message);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar mensagem!");
        }

        return ApiResponse::success($result, "Mensagem atualizada");
    }

    public function updateAppSharingDriverMessage(Request $request): JsonResponse
    {
        try {
            if (!isset($request->message)) {
                throw new Exception("Mensagem não enviada!");
            }
            $result = $this->service
                ->updateAppSharingDriverMessage($request->message);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar mensagem!");
        }

        return ApiResponse::success($result, "Mensagem atualizada");
    }

    public function updateBillingDate(Request $request)
    {
        try {
            if (!isset($request->billingDate)) {
                throw new Exception("Data de cobrança não enviada!");
            }
            $result = $this->service
                ->updateBillingDate($request->billingDate);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar data de cobrança!");
        }

        return ApiResponse::success($result, "Data de cobrança atualizada");
    }

    public function updateCodePhoneCountry(Request $request)
    {
        try {
            if (!isset($request->codePhoneCountry)) {
                throw new Exception("Código de telefone do país não enviado!");
            }
            $result = $this->service
                ->updateCodePhoneCountry($request->codePhoneCountry);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar código de telefone do país!");
        }

        return ApiResponse::success($result, "Código de telefone do país atualizado");
    }

    public function updateEnableBuyVoucher(Request $request)
    {
        try {
            if (!isset($request->enable) || !is_bool($request->enable)) {
                throw new Exception("Habilitar/Desabilitar compra de Voucher não enviado ou está inválido!");
            }
            $result = $this->service
                ->updateEnableBuyVoucher($request->enable);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar compra de Voucher!");
        }

        return ApiResponse::success($result);
    }

    public function getAdditionalConfigs()
    {
        try {
            $result = $this->service
                ->getAdditionalConfigs();
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações adicionais!");
        }

        return ApiResponse::success($result);
    }

    public function findAll(): JsonResponse
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações!");
        }

        return ApiResponse::success($result);
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $result = $this->service->updateConfig($request->all());
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar configuração!");
        }

        return ApiResponse::success($result);
    }

    public function getTripTypesText(): JsonResponse
    {
        return ApiResponse::success($this->service->getTripTypesText());
    }

    public function updateTripTypesText(UpdateTripTypesTextRequest $request)
    {
        return ApiResponse::success($this->service->updateTripTypesText($request->validated()));
    }

    public function getRealtimeDatabase()
    {
        return ApiResponse::success($this->service->getRealtimeDatabase());
    }

    public function toggleRealtimeDatabase(UpdateRealtimeDatabaseRequest $request)
    {
        return ApiResponse::success($this->service->toggleRealtimeDatabase($request->validated()['status']));
    }
}
