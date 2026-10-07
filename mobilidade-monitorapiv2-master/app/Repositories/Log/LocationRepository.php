<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2020
 * Time: 11:40
 */

namespace App\Repositories\Log;


use App\Contracts\Repository\AbstractODMRepository;
use App\Documents\Location;
use Jenssegers\Mongodb\Collection;

class LocationRepository extends AbstractODMRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Location::class);
    }

    public function findByTrip($tripReference)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->whereNotNull('driverId')
            ->orderByDesc('registered_at')
            ->get();
    }

    public function findByDriver($driverId, ?string $limit = null)
    {
        $limit = $limit ? (int) $limit : null;

        return $this->getModel()
            ::orderBy('registered_at', 'desc')
            ->where('driverId', (int) $driverId)
            ->orWhere('driverId', $driverId)
            ->limit($limit ?? 10)
            ->get();
    }
}
