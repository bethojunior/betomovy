<?php

namespace Delivery\Repositories\Driver;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Driver\DriversCloseDeliveryOrder;
use Delivery\Models\Order\DeliveryOrder;
use Illuminate\Database\Eloquent\Builder;

class DriversCloseDeliveryOrderRepository extends AbstractRepository
{

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
