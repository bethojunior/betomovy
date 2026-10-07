<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 17:24
 */

namespace Common\Repositories\Driver;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Driver\DriverCalled;
use Illuminate\Database\Eloquent\Builder;

class DriverCalledRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DriverCalled::class);
    }

    public function getStatusDriver(int $driverCalledId)
    {
        return $this->getModel()
            ::where('driverCalled.id', $driverCalledId)
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.deliveryOrderId',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->orderByDesc('driverCalled.updated_at')
            ->first();
    }

    public function getAllDriversByDeliveryOrder(int $deliveryOrderId)
    {
        return $this->getModel()
            ::where('driverCalled.deliveryOrderId', $deliveryOrderId)
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.deliveryOrderId',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->orderByDesc('driverCalled.updated_at')
            ->get();
    }

    public function updateStatusByDeliveryOrder(int $deliveryOrderId, string $status, ?string $whereStatus = null)
    {
        return $this->getModel()
            ::where('deliveryOrderId', $deliveryOrderId)
            ->when($whereStatus, function (Builder $query) use ($whereStatus){
                $query
                    ->where('status', $whereStatus);
            })
            ->update(['status' => $status]);
    }
}
