<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 17:05
 */

namespace Api\Repositories\Order;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryOrderStatus;

class DeliveryOrderStatusRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryOrderStatus::class);
    }

    public function findManageable()
    {
        return $this->getModel()
            ::where('manageable', true)
            ->get();
    }
}
