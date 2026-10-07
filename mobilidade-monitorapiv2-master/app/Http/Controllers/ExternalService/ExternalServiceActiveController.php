<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 16:52
 */

namespace App\Http\Controllers\ExternalService;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ExternalService\ExternalServiceActive;
use App\Services\ExternalService\ExternalServiceActiveService;
use Illuminate\Http\Request;

class ExternalServiceActiveController extends Controller
{
    /**
     * @var ExternalServiceActiveService
     */
    private $service;

    public function __construct(ExternalServiceActiveService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar serviços externos ativos");
        }

        return ApiResponse::success($result);
    }

    public function updateExternalServiceType(ExternalServiceActive $externalServiceActive, Request $request)
    {
        try {
            $result = $this->service
                ->updateExternalServiceType($externalServiceActive, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipos de notificação");
        }

        return ApiResponse::success($result);
    }
}
