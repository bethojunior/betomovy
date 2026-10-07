<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 09:51
 */

namespace Common\Repositories;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Driver\DriversCloseDeliveryOrder;
use Common\Models\Order\DeliveryOrder;
use Illuminate\Database\Eloquent\Builder;

class DriversCloseDeliveryOrderRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriversCloseDeliveryOrder::class);
    }

    public function findDriversClose(DeliveryOrder $deliveryOrder, ?int $limit = null, array $notDrivers = [])
    {
        return $this->getModel()
            ::selectRaw("
                id,
                driverName,
                idDriver,
                proximity,
                radius,
                greaterRadius,
                driverType,
                deliveryOrderStatus,
                deliveryOrderStatusId,
                preAvailable,
                deviceToken
            ")
            ->where('id', $deliveryOrder->id)
            ->whereRaw("proximity < greaterRadius")
            ->whereNotIn('idDriver', $notDrivers)
            ->orderBy('proximity')
            ->when($limit, function (Builder $query) use ($limit) {
                $query->limit($limit);
            })
            ->get();
    }
}
