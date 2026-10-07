<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 21:19
 */

namespace App\Repositories\Trip;


use App\Constants\Trip\DriverCalledConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\DriverCalled;

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

    public function getByTrip($tripReference)
    {
        return $this->getModel()
            ::where('driverCalled.tripReference', $tripReference)
            ->join(
                'tripDrivers', 'driverCalled.tripReference',  '=', 'tripDrivers.tripReference')
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.tripReference',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->get();
    }

    public function renewList($tripReference, $status = null)
    {
        return $this->getModel()
            ::where('driverCalled.tripReference', $tripReference)
            ->join(
                'tripDrivers', 'driverCalled.tripReference',  '=', 'tripDrivers.tripReference')
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.tripReference',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->when($status,
                function ($query) use ($status){
                    $query
                        ->where('driverCalled.status', $status);
                },
                function ($query) {
                    $query
                        ->whereNull('driverCalled.status');
                }
            )
            ->get();
    }

    public function getStatusDriver($tripReference, $driverCalledId)
    {
        return $this->getModel()
            ::where('driverCalled.tripReference', $tripReference)
            ->where('driverCalled.id', $driverCalledId)
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.tripReference',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->orderByDesc('driverCalled.updated_at')
            ->first();
    }

    public function getStatusAllDrivers($tripReference)
    {
        return $this->getModel()
            ::where('driverCalled.tripReference', $tripReference)
            ->where('driverCalled.status', '<>', DriverCalledConst::NOT_ANSWERED)
            ->join('driver', 'idDriver', '=', 'driverCalled.driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->select(
                'driverCalled.id',
                'driverCalled.driverId',
                'driverCalled.tripReference',
                'driverCalled.proximity',
                'driverCalled.created_at',
                'driverCalled.updated_at',
                'driverCalled.status',
                'deviceToken')
            ->orderByDesc('driverCalled.updated_at')
            ->get();
    }

    public function updateManyStatusById(array $driverCalledIds, $status)
    {
        return $this->getModel()
            ::whereIn('id', $driverCalledIds)
            ->update([
                'status' => $status,
                'updated_at' => \Illuminate\Support\Facades\DB::raw('UTC_TIMESTAMP()'),
            ]);
    }
}
