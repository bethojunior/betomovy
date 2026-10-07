<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/10/2019
 * Time: 09:38
 */

namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripDriver;

class TripDriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(TripDriver::class);
    }

    public function findByTripReference($tripReference)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->first();
    }
}
