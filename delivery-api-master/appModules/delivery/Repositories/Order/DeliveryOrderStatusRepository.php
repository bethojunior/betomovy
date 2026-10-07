<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 18:15
 */

namespace Delivery\Repositories\Order;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryOrderStatus;

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

    public function findShowableInApp()
    {
        return $this->getModel()
            ::where('showableInApp', true)
            ->get();
    }
}
