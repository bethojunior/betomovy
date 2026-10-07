<?php

namespace App\Http\Controllers\Monitoring;

use App\Helpers\CityIdHelper;
use App\Http\Controllers\Controller;
use App\Processor\Monitoring\MonitoringProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;

class MonitoringController extends Controller
{
    /**
     * @var MonitoringProcessor
     */
    private $monitoringProcessor;
    /**
     * @var PulseProvider
     */
    private $pulseProvider;

    public function __construct(MonitoringProcessor $monitoringProcessor)
    {
        $this->monitoringProcessor = $monitoringProcessor;
        $this->pulseProvider = new PulseProvider("central", GroupIds::CENTRAL_PROD);
    }

    public function handle(int $centralId, Request $request): JsonResponse
    {
        try {
            $cityId = CityIdHelper::parseFromRequest($request);
            $data = $this->monitoringProcessor->execute($centralId, $cityId);
        } catch (\Exception $e) {
            $this->pulseProvider->error('error', 'Erro ao processar a requisição de monitoramento', [
                'centralId' => $centralId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Erro ao processar a requisição.',
            ], 500);
        }
        return response()->json([
            'data' => $data,
        ]);
    }
}
