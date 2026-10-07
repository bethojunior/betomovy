<?php

namespace App\Jobs\Config;

use App\Repositories\Locale\CityRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use App\Utils\Polygon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncCityAreaToAdmin704AppsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;
    public int $tries = 3;

    protected int $adminCityId;
    protected int $localCityId;
    protected array $requestData;

    public function __construct(int $adminCityId, int $localCityId, array $requestData)
    {
        $this->adminCityId = $adminCityId;
        $this->localCityId = $localCityId;
        $this->requestData = $requestData;
    }

    public function handle(Admin704Apps $admin704Apps, CityRepository $cityRepository): void
    {
        $request = $this->requestData;
        $request['polygon'] = $this->resolvePolygon($cityRepository);

        $admin704Apps->updateCityArea($this->adminCityId, $request);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Falha ao sincronizar area da cidade com Admin704Apps', [
            'adminCityId' => $this->adminCityId,
            'localCityId' => $this->localCityId,
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ]);
    }

    private function resolvePolygon(CityRepository $cityRepository): array
    {
        $city = $cityRepository->findWithCityAreaById($this->localCityId);

        if (is_null($city) || empty($city->polygon)) {
            throw new \RuntimeException(
                "Poligono nao encontrado para sincronizar a cidade local {$this->localCityId}."
            );
        }

        return array_map(
            static function ($point) {
                return ['lat' => $point->lat, 'lng' => $point->lng];
            },
            Polygon::polygonToArray($city->polygon)
        );
    }
}
