<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 16:25
 */

namespace App\Helpers\Driver;


use App\Constants\Trip\TripConst;
use App\Constants\Users\DriverConst;
use App\Models\User\Driver;
use App\Repositories\Central\CentralCustomerRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\TripWayPointRepository;
use App\Repositories\User\DriverRepository;

class DriverHelper
{
    /**
     * @var DriverRepository
     */
    private $repository;
    /**
     * @var TripRepository
     */
    private $tripRepository;
    /**
     * @var TripWayPointRepository
     */
    private $tripWayPointRepository;
    /**
     * @var CentralCustomerRepository
     */
    private $centralCustomerRepository;

    public function __construct(DriverRepository $repository,
                                TripRepository $tripRepository,
                                TripWayPointRepository $tripWayPointRepository,
                                CentralCustomerRepository $centralCustomerRepository)
    {
        $this->repository = $repository;
        $this->tripRepository = $tripRepository;
        $this->tripWayPointRepository = $tripWayPointRepository;
        $this->centralCustomerRepository = $centralCustomerRepository;
    }

    public function putDriverAvailable($driverId)
    {
        /** @var Driver $driver */
        $driver = $this->repository
            ->find($driverId);

        $trips = $this->tripRepository
            ->findActivesByDriver($driverId);

        $status = $trips->isEmpty() ? DriverConst::AVAILABLE : DriverConst::IN_TRIP;

        if ($status == DriverConst::IN_TRIP &&
            $trips->count() == 1 &&
            $trips->first()->status == TripConst::PRE_ACCEPTED)
                $this->tripRepository->updateStatusTrip(
                    $trips->first()->tripReference, TripConst::ACCEPTED);

        $driver
            ->status = $status;

        return $this->repository->save($driver);
    }
}
