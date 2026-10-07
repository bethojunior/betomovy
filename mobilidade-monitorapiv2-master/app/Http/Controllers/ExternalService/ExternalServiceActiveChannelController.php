<?php
/**
 * Controller para externalServiceActiveChannel
 */

namespace App\Http\Controllers\ExternalService;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ExternalService\ExternalServiceActiveChannel;
use App\Services\ExternalService\ExternalServiceActiveChannelService;
use Illuminate\Http\Request;

class ExternalServiceActiveChannelController extends Controller
{
    /**
     * @var ExternalServiceActiveChannelService
     */
    private $service;

    public function __construct(ExternalServiceActiveChannelService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar canais de serviços externos ativos");
        }
        return ApiResponse::success($result);
    }

    public function updateExternalServiceType(ExternalServiceActiveChannel $externalServiceActiveChannel, Request $request)
    {
        try {
            $result = $this->service->updateExternalServiceType($externalServiceActiveChannel, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipos de notificação do canal");
        }
        return ApiResponse::success($result);
    }
}
