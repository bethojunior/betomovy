<?php

namespace app\services;

use app\constant\PushConst;
use app\dao\LogDao;
use app\dao\PushConfigDao;
use app\dao\RiderDao;
use app\dao\TripDao;
use app\dao\UserTypeDao;
use app\model\Rider;
use app\model\Trip;
use app\realtime\MessagesChatTripRealtime;
use app\realtime\TripRealtime;
use app\realtime\TripRouteRealtime;
use app\utils\Connection;
use app\utils\Push;
use app\utils\RedisUtil;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/01/2020
 * Time: 09:39
 */
class CancelRideService
{
    /**
     * @var TripDao
     */
    private $tripDao;
    /**
     * @var \MongoDB\Driver\Manager|PDO
     */
    private $conn;
    /**
     * @var RiderDao
     */
    private $riderDao;
    /**
     * @var RidePaymentService
     */
    private $ridePaymentService;
    /**
     * @var \app\realtime\TripRealtime
     */
    private $tripRealtime;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->riderDao = new RiderDao;
        $this->tripDao = new TripDao;
        $this->ridePaymentService = new RidePaymentService;
        $this->tripRealtime = new TripRealtime;
    }

    /**
     * @param $userId
     * @param stdClass $request
     * @return bool
     * @throws Exception
     */
    public function byCustomer($userId, stdClass $request): bool
    {
        $trip = $this->tripDao
            ->find($request->tripReference ?? '');

        try {
            $this->conn->beginTransaction();

            $this->refundUserBalances($trip->ride->id, [$userId]);

            $this->conn->commit();

            $trip = $this->tripDao->find($request->tripReference);

            $this->tripRealtime
                ->hydrate($trip)
                ->createTrip();

            $push = new Push();
            $push
                ->setTitle('Viagem compartilhada')
                ->setMessage("Um cliente desistiu da viagem")
                ->setPriority(PushConst::HIGH_PRIORITY);

            $push->sendNotificationWithData($trip->driver->deviceToken);
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }

        return true;
    }

    /**
     * @param stdClass $request
     * @return bool
     * @throws Exception
     */
    public function byDriver(stdClass $request): bool
    {
        $this->conn->beginTransaction();

        try {
            $trip = $this->tripDao
                ->find($request->tripReference ?? '');

            $this->validateCancelTrip($trip->status);

            $driverType = (new UserTypeDao())->find($trip->driver->userTypeId);

            $ride = $trip->ride;

            $this->tripDao
                ->cancelByDriver($request->tripReference, $request->cancellationReasonsId);

            $trip->status = Trip::CANCELED;
            $trip->canceledBy = Trip::CANCELED_BY_DRIVER;

            $this->refundUserBalances($ride->id, array_map(function ($rider) {
                return $rider->userId;
            }, $ride->riders));

            $this->deleteRealtime($request->tripReference);
            (new RedisUtil)->delete("trip-{$request->tripReference}");

            $this->conn->commit();

            $pushConfig = (new PushConfigDao())->find('scheduled_shared_trip_canceled_by_driver');


            array_map(function ($rider) use ($pushConfig, $driverType) {
                $push = new Push();
                $push
                    ->setTitle($pushConfig->getTitle())
                    ->setMessage(str_replace('{driverType}', $driverType->name, $pushConfig->getMessage()))
                    ->setPriority(PushConst::HIGH_PRIORITY);

                return $push->sendNotificationWithData($rider->deviceToken);
            }, $ride->riders);

        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }

        return true;
    }

    /**
     * @param $rideId
     * @param array $usersId
     * @throws Exception
     */
    private function refundUserBalances($rideId, array $usersId): void
    {
        foreach ($usersId as $userId) {
            $riders = $this->riderDao->findByRidersAndUser($rideId, $userId);

            array_map(function ($rider) {
                $this->riderDao->cancelRider($rider->id);

                $this->ridePaymentService->ridePaymentOnCancel(new Rider($rider));
            }, $riders);
        }
    }

    /**
     * @param string $tripReference
     */
    private function deleteRealtime(string $tripReference): void
    {
        (new MessagesChatTripRealtime)
            ->deleteAll($tripReference);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();

        (new TripRouteRealtime)
            ->setDocumentId($tripReference)
            ->delete();
    }

    /**
     * @param $status
     * @throws Exception
     */
    private function validateCancelTrip($status)
    {
        if ($status == Trip::CANCELED)
            throw new Exception("Viagem já cancelada");

        if ($status == Trip::FINISHED)
            throw new Exception("Viagem já finalizada");
    }
}