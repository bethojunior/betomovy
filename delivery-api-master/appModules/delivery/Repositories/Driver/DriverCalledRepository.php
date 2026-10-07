<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 14:38
 */

namespace Delivery\Repositories\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Driver\DriverCalled;

class DriverCalledRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverCalled::class);
    }

    public function updateStatusByDriverAndDeliveryOrder(int $driverId, int $deliveryOrderId, string $status)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->where('deliveryOrderId', $deliveryOrderId)
            ->update(['status' => $status]);
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

    /**
     * @param $id
     * @param array $values
     * @param string $primaryKey
     * @return int
     */
    public function updateById($id, array $values, $primaryKey = 'id')
    {
        return $this->getModel()
            ::where($primaryKey, $id)
            ->update($values);
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
}
