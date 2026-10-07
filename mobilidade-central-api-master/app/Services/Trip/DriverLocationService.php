<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 16:31
 */

namespace App\Services\Trip;


use App\Models\Trip\Trip;
use App\Repositories\Log\LocationRepository;
use App\Repositories\Trip\TripRepository;
use App\Utils\Polyline;
use Illuminate\Database\Eloquent\Collection;

class DriverLocationService
{
    /**
     * @var LocationRepository
     */
    private $repository;
    /**
     * @var TripRepository
     */
    private $tripRepository;

    public function __construct(LocationRepository $repository, TripRepository $tripRepository)
    {
        $this->repository = $repository;
        $this->tripRepository = $tripRepository;
    }

    /**
     * @param string $tripReference
     * @return array|string[]|null
     */
    public function findDriverPositionsByTrip(string $tripReference): ?array
    {
        /** @var Trip $trip */
        $trip = $this->tripRepository
            ->findByReference($tripReference);

        if (!$trip->driverId)
            return null;

        $locations = $this->repository
            ->findByTripAndDriver($trip->tripReference, $trip->driverId);

        $lastPosition = $locations->first();

        return [
            'points' => $this->getOverviewPolyLine($locations),
            'actual' => [
                'latitude' => $lastPosition->latitude,
                'longitude' => $lastPosition->longitude,
            ]
        ];
    }

    /**
     * @param Collection $locations
     * @return string
     */
    private function getOverviewPolyLine(Collection $locations): string
    {
        $coordinates = [];

        foreach ($locations as $location) {
            if ($location->latitude && $location->longitude)
                $coordinates[] = [$location->latitude, $location->longitude];
        }

        return Polyline::encode($coordinates);
    }
}
