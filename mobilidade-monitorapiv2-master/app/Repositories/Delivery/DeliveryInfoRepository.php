<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2019
 * Time: 11:11
 */

namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryInfo;

class DeliveryInfoRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryInfo::class);
    }
}
