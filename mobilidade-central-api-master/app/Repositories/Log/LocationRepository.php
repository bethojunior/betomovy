<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 16:33
 */

namespace App\Repositories\Log;


use App\Contracts\Repository\AbstractODMRepository;
use App\Documents\Location;
use Jenssegers\Mongodb\Eloquent\Builder;

class LocationRepository extends AbstractODMRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Location::class);
    }

    public function findByTripAndDriver(string $tripReference, int $driverId)
    {
        return $this->getModel()
            ::orderByDesc('registered_at')
            ->where(function (Builder $query) use ($driverId) {
                $query
                    ->where('driverId', (int) $driverId)
                    ->orWhere('driverId', $driverId);
            })
            ->where('tripReference', $tripReference)
            ->get();
    }
}
