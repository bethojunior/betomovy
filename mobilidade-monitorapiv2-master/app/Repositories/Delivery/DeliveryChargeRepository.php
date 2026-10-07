<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2020
 * Time: 19:17
 */

namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryCharge;

class DeliveryChargeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryCharge::class);
    }

    public function findUnique()
    {
        return $this->getModel()
            ::first();
    }
}
