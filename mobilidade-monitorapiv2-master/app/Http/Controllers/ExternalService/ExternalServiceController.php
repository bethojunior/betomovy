<?php


namespace App\Http\Controllers\ExternalService;


use App\Http\Controllers\Controller;
use App\Http\Requests\Config\ExternalServiceRequest;
use App\Http\Responses\ApiResponse;
use App\Models\ExternalService\ExternalService;
use App\Services\ExternalService\ExternalServiceService;
use Illuminate\Http\Request;

class ExternalServiceController extends Controller
{
    private $service;

    public function __construct(ExternalServiceService $service)
    {
        $this->service = $service;
    }

    public function findAllTypeSms(Request $request)
    {
        try {
            $data = $this->service->findAllTypeSms($request->query->all(), $request->header('cityid'));
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }
    }

    public function findAllTypeSmsByCity(Request $request)
    {
        try {
            if (!$request->hasHeader('cityid')) throw new \Exception("Cidade não informada");
            $data = $this->service->findAllTypeSmsByCity($request->header('cityid'), $request->query->all());
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }
    }

    public function update(ExternalService $externalService, ExternalServiceRequest $request)
    {
        try {
            $result = $this->service
                ->update($externalService, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar serviço");
        }

        return ApiResponse::success($result);
    }

    public function updateByCity(ExternalService $externalService, ExternalServiceRequest $request)
    {
        try {
            if (!$request->header('cityid')) throw new Exception('É necessário informar a cidade');
            $result = $this->service
                ->updateByCity($externalService, $request->validated(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar serviço");
        }

        return ApiResponse::success($result);
    }

    public function sendSmsTest(Request $request)
    {
        try {
            $result = $this->service->sendSmsTest($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar serviço");
        }

        return ApiResponse::success($result);
    }
}
