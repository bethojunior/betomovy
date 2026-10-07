<?php

namespace App\Services\Driver;

use App\Repositories\Log\LocationRepository;
use App\Repositories\Trip\TripRouteTracingRepository;
use App\Utils\Polyline;
use Illuminate\Database\Eloquent\Collection;

class DriverLocationService
{
    private LocationRepository $locationRepository;
    private TripRouteTracingRepository $routeTracingRepository;

    public function __construct(
        LocationRepository $locationRepository,
        TripRouteTracingRepository $routeTracingRepository
    ) {
        $this->locationRepository     = $locationRepository;
        $this->routeTracingRepository = $routeTracingRepository;
    }

    public function findByTrip(string $tripReference): array
    {
        $tracing = $this->routeTracingRepository->findTracingByTrip($tripReference);

        if ($tracing !== null) {
            return ['points' => $tracing];
        }

        // Fallback: MongoDB — dados anteriores à migração Redis de 02/03/2026
        $locations = $this->locationRepository->findByTrip($tripReference);

        return ['points' => $this->buildPolyline($locations)];
    }

    public function findByDriver($driverId, $request): Collection
    {
        $limit = $request['limit'] ?? null;

        return $this->locationRepository
            ->findByDriver($driverId, is_numeric($limit) ? (string) $limit : null);
    }

    private function buildPolyline(Collection $locations): string
    {
        $coordinates = array_reduce(
            $locations->all(),
            static function (array $carry, $location): array {
                if ($location->latitude && $location->longitude) {
                    $carry[] = [$location->latitude, $location->longitude];
                }
                return $carry;
            },
            []
        );

        return Polyline::encode($coordinates);
    }
}
