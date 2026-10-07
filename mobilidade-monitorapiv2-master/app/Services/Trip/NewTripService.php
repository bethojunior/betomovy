<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 16:37
 */

namespace App\Services\Trip;


use App\Constants\Trip\TripCallTypeConst;
use App\Contracts\Exception\CustomException;
use App\Exceptions\Central\CentralCustomerException;
use App\Exceptions\Trip\DriverCommissionException;
use App\Exceptions\Trip\ZoneException;
use App\Models\Trip\Trip;
use App\Models\Trip\TripWayPoint;
use App\Models\User\User;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Central\CentralCustomerRepository;
use App\Repositories\Log\LogRepository;
use App\Repositories\Realtime\TripRepository as RealtimeTripRepository;
use App\Repositories\Trip\DestinationRepository;
use App\Repositories\Trip\DriverCalledRepository;
use App\Repositories\Trip\DriverCommissionRepository;
use App\Repositories\Trip\DriversCloseTheTripRepository;
use App\Repositories\Trip\OriginRepository;
use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\ZoneRepository;

class NewTripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var DriverCommissionRepository
     */
    private $driverCommissionRepository;
    /**
     * @var ZoneRepository
     */
    private $zoneRepository;
    /**
     * @var DriversCloseTheTripRepository
     */
    private $driversCloseTheTripRepository;
    /**
     * @var DriverCalledRepository
     */
    private $driverCalledRepository;
    /**
     * @var OriginRepository
     */
    private $originRepository;
    /**
     * @var DestinationRepository
     */
    private $destinationRepository;
    /**
     * @var RealtimeTripRepository
     */
    private $realtimeRepository;
    /**
     * @var CentralCustomerRepository
     */
    private $centralCustomerRepository;
    /**
     * @var LogRepository
     */
    private $logRepository;

    public function __construct(TripRepository $repository,
                                DriverCommissionRepository $driverCommissionRepository,
                                ZoneRepository $zoneRepository,
                                DriversCloseTheTripRepository $driversCloseTheTripRepository,
                                DriverCalledRepository $driverCalledRepository,
                                OriginRepository $originRepository,
                                DestinationRepository $destinationRepository,
                                CentralCustomerRepository $centralCustomerRepository,
                                RealtimeTripRepository $realtimeRepository,
                                LogRepository $logRepository)
    {
        $this->repository = $repository;
        $this->driverCommissionRepository = $driverCommissionRepository;
        $this->zoneRepository = $zoneRepository;
        $this->driversCloseTheTripRepository = $driversCloseTheTripRepository;
        $this->driverCalledRepository = $driverCalledRepository;
        $this->originRepository = $originRepository;
        $this->destinationRepository = $destinationRepository;
        $this->realtimeRepository = $realtimeRepository;
        $this->centralCustomerRepository = $centralCustomerRepository;
        $this->logRepository = $logRepository;
    }

    /**
     * @param $request
     * @param User $user
     * @return Trip
     * @throws CustomException
     * @throws \Exception
     */
    public function newTrip($request, User $user)
    {
        try {
            \DB::beginTransaction();

            $trip = $this->startTrip($request, $user->idUser);

            if (isset($request['waypoints']) && !empty($request['waypoints']))
                $this->tripWayPoints($trip, $request['waypoints']);

            $resultRealtime = $this->sendToRealtime($trip);

            $driversClose = $this->callDriversClose($trip, $request['centralId']);

            \DB::commit();

            $this->log([
                'trip' => $trip->toArray(),
                'realtime' => $resultRealtime,
                'driversClose' => $driversClose->toArray()
            ], $user->idUser, $trip->tripReference);

            exec(
                "nohup php ../../taxireturnapi/console/command.php trip-call {$trip->tripReference} > /dev/null 2>&1 & echo $! ");

        } catch (CustomException $e) {
            \DB::rollBack();

            throw $e;
        }

        return $trip;
    }

    /**
     * @param $request
     * @param $userId
     * @return Trip
     * @throws DriverCommissionException
     * @throws ZoneException
     */
    private function startTrip($request, $userId)
    {
        $trip = new Trip($request);
        $trip->userId = $userId;
        $trip->tripCallTypeId = TripCallTypeConst::CENTRAL_CALL;

        $trip
            ->centralCustomer()
            ->associate(
                $this->findOrCreateCustomer(
                    $request['tripCustomer'], $request['centralId']));

        $trip
            ->origin()
            ->associate(
                $this->originRepository
                    ->create($request['origin']));

        $trip
            ->destination()
            ->associate(
                $this->destinationRepository
                    ->create($request['destination']));

        $trip
            ->driverCommission()
            ->associate(
                $this->findDriverCommission(
                    $request['cityId'], $request['tripTypeId']));

        $trip
            ->zone()
            ->associate(
                $this->findZone($request['centralId']));

        $trip->save();

        return $trip;
    }

    /**
     * @param $request
     * @param $centralId
     * @return CentralCustomerRepository|CentralCustomerRepository[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model|mixed|null
     */
    private function findOrCreateCustomer($request, $centralId)
    {
        if (isset($request['id']))
            $centralCustomer = $this->centralCustomerRepository
                ->find($request['id']);

        $request = array_merge($request, compact('centralId'));

        $centralCustomer = $centralCustomer ?? $this->centralCustomerRepository
            ->create($request);

        return $centralCustomer;
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @return DriverCommissionRepository|\Illuminate\Database\Eloquent\Model|null|object
     * @throws DriverCommissionException
     */
    private function findDriverCommission($cityId, $tripTypeId)
    {
        $driverCommission = $this->driverCommissionRepository
            ->findByCityAndTripType($cityId, $tripTypeId);

        if (!$driverCommission)
            throw new DriverCommissionException("Comissão do motorista não encontrada");

        return $driverCommission;
    }

    /**
     * @param $centralId
     * @return ZoneRepository|\Illuminate\Database\Eloquent\Model|null|object
     * @throws ZoneException
     */
    private function findZone($centralId)
    {
        $zone = $this->zoneRepository
            ->findByCentral($centralId);

        if (!$zone)
            throw new ZoneException("Raio de chamamento não encontrada");

        return $zone;
    }

    private function tripWayPoints(Trip &$trip, array $tripWayPoints)
    {
        $trip
            ->tripWayPoints()
            ->saveMany(array_map(function ($tripWayPoint) use ($trip){
                $tripWayPoint = new TripWayPoint($tripWayPoint);
                $tripWayPoint
                    ->setAttribute('tripReference',
                        $trip
                            ->getAttribute('tripReference'));

                return $tripWayPoint;
            }, $tripWayPoints));
    }

    private function callDriversClose(Trip $trip, $centralId)
    {
        $drivers = $this->driversCloseTheTripRepository
            ->findDriversClose($trip->tripReference, $centralId);

        return $drivers->map(function ($driver){
            $driverCalled = $this->driverCalledRepository
                ->create([
                    'driverId' => $driver->idDriver,
                    'tripReference' => $driver->tripReference,
                    'proximity' => $driver->proximity,
                    'destinationProximity' => $driver->destinationProximity
                ]);

            return $driverCalled;
        });
    }

    private function sendToRealtime(Trip $trip)
    {
        $tripRealtime = new RealtimeTrip;
        $tripRealtime
            ->mount((object) $trip->toArray());

        return $this->realtimeRepository
            ->setRealtime($tripRealtime)
            ->save();
    }

    private function log($data, $user_id, $tripReference)
    {
        return $this->logRepository
            ->insert(
                $data,
                "VIAGEM INSERIDA PELA CENTRAL",
                $user_id,
                $tripReference
            );
    }
}
