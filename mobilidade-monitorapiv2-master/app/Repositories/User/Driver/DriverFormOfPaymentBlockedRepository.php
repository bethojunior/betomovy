<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 15:39
 */

namespace App\Repositories\User\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverFormOfPaymentBlocked;

class DriverFormOfPaymentBlockedRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverFormOfPaymentBlocked::class);
    }

    public function findByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->with('tripPaymentForm')
            ->get();
    }

    public function deleteAllByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->delete();
    }
}
