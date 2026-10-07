<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 09:23
 */

namespace Api\Repositories\Order\DeliveryOrderAction;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryOrder;

class CompanyOrderActionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryOrder::class);
    }
}
