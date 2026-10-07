<?php


namespace App\Http\Controllers\Price\Dynamic;


use App\Http\Controllers\Controller;
use App\Http\Requests\Price\PriceDynamicScheduledRequest;
use App\Http\Requests\Price\PriceDynamicScheduledRequestUpdate;
use App\Http\Responses\ApiResponse;
use App\Models\Price\Dynamic\PriceDynamicScheduled;
use App\Services\Price\Dynamic\PriceDynamicScheduledService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PriceDynamicScheduledController extends Controller
{
    private $service;

    public function __construct(PriceDynamicScheduledService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityid'));

            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao listar Gatilhos de dinâmica');
        }
    }

    public function store(PriceDynamicScheduledRequest $request): JsonResponse
    {
        try {
            $payload = $request->validated();
            $tripTypeIds = $payload['tripTypeId'];

            $results = [];
            foreach ($tripTypeIds as $tripTypeId) {
                $data = array_merge($payload, ['tripTypeId' => $tripTypeId]);
                $results[] = $this->service->store($data);
            }

            return ApiResponse::success($results, "Gatilhos de dinâmica inseridos com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao inserir gatilhos de dinâmica');
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $data = $this->service->show($id);

            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar gatilho de dinâmica');
        }
    }

    public function update(PriceDynamicScheduledRequestUpdate $request, int $id): JsonResponse
    {
        try {
            $data = $this->service->update($request->validated(), $id);

            return ApiResponse::success($data, "Gatilho de dinâmica atualizado com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao atualizar gatilho de dinâmica');
        }
    }

    public function delete(PriceDynamicScheduled $priceDynamicScheduled): JsonResponse
    {
        try {
            $result = $this->service->delete($priceDynamicScheduled);

            return ApiResponse::success($result, "Gatilho de dinâmica deletado com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar gatilho de dinâmica");
        }
    }
}
