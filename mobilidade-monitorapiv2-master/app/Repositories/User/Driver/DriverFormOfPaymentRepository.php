<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 13:55
 */

namespace App\Repositories\User\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverFormOfPayment;

class DriverFormOfPaymentRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverFormOfPayment::class);
    }

    public function findByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->with('tripPaymentForm')
            ->get();
    }

    public function findByDriverAndTripPaymentForm(int $driverId, int $tripPaymentFormId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->where('tripPaymentFormId', $tripPaymentFormId)
            ->with('tripPaymentForm')
            ->first();
    }
}
