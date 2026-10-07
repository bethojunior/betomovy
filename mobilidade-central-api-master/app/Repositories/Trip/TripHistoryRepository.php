<?php

namespace App\Repositories\Trip;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripHistory;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\User\DriverRepository;

class TripHistoryRepository extends AbstractRepository
{
    /**
     * @var DriverRepository
     */
    private $driverRepository;
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripHistory::class);

        $this->driverRepository = app(DriverRepository::class);
        $this->balanceRepository = app(BalanceRepository::class);
    }

    public function findByTrip($tripReference, $driverId = null)
    {
        return $this->getModel()
            ::query()
            ->where('tripReference', $tripReference)
            ->when($driverId, function ($query) use ($driverId) {
                $query->where('driverId', $driverId);
            })
            ->first();
    }

    /**
     * @param iterable $trips
     * @param $driverId
     * @return void
     */
    public function insertTripsFound($trips, $driverId = null): void
    {
        foreach ($trips as $trip) {
            $tripReference = is_array($trip) ? ($trip['tripReference'] ?? null) : ($trip->tripReference ?? null);

            if (!$tripReference || $this->findByTrip($tripReference, $driverId)) {
                continue;
            }

            $attributes = [
                'driverId' => $driverId,
                'tripReference' => $tripReference,
                'date' => now(),
            ];

            if ($driverId) {
                $driverBalance = $this->getDriverBalance($driverId);

                if ($driverBalance !== null) {
                    $attributes['driverBalanceInStartCall'] = $driverBalance;
                }
            }

            $this->create($attributes);
        }
    }

    private function getDriverBalance($driverId): ?float
    {
        $driver = $this->driverRepository->find($driverId, ['idDriver', 'balanceId']);

        if (!$driver || !$driver->balanceId) {
            return null;
        }

        $balance = $this->balanceRepository->find($driver->balanceId, ['idBalance', 'balance']);

        return $balance && isset($balance->balance) ? (float)$balance->balance : null;
    }
}
