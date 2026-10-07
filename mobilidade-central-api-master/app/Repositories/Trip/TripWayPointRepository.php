<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 17:51
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripWayPoint;

class TripWayPointRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripWayPoint::class);
    }

    public function findByTripReference($tripReference)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->get();
    }
}
