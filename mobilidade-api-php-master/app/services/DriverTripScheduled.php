<?php

namespace app\services;

use app\constant\PushActionConst;
use app\dao\LogDao;
use app\dao\PushConfigDao;
use app\dao\TripDao;
use app\dao\TripScheduledDao;
use app\model\Config;
use app\realtime\TripRealtime;
use app\utils\Connection;
use app\utils\Push;
use app\utils\RedisUtil;
use Exception;
use stdClass;

class DriverTripScheduled
{
    private $tripDao;
    private $conn;
    private $tripRealtime;
    private $tripScheduledDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->tripDao = new TripDao;
        $this->tripScheduledDao = new TripScheduledDao;
        $this->tripRealtime = new TripRealtime;
    }


    public function accept($request)
    {
        try {
            $this->conn->beginTransaction();
            $trip = $this->tripDao
                ->find($request->tripReference);

            if ($trip->driverId)
                throw new Exception("Esse chamado já foi aceito");

            if (!empty($trip->favoriteDrivers)) {
                $allowedDriverIds = explode(',', $trip->favoriteDrivers);

                if (!in_array((string) $request->driverId, $allowedDriverIds, true))
                    throw new Exception("Você não está autorizado a aceitar este agendamento");
            }

            $tripsScheduled = $this->tripScheduledDao
                ->findUpcomingTripsScheduledByDriver($trip->schedule->schedule, $request->driverId);

            if (!empty($tripsScheduled))
                throw new Exception("Você já possui viagem próximo a esse horário");

            $this->tripDao
                ->updateDriver($request->tripReference, $request->driverId);

            $this->tripScheduledDao
                ->updateDriver($request->tripReference, $request->driverId);

            $trip = $this->tripDao
                ->find($request->tripReference);

            $this->tripRealtime->hydrate($trip)->createTrip();

            $this->conn->commit();

            (new RedisUtil)->set("trip-{$trip->tripReference}", $trip);

            $this->notifyCustomerBeenTripAcceptedScheduled($trip->customer->deviceToken ?? null, $trip->driver);
        } catch (Exception $e) {
            $this->conn->rollBack();

            (new LogDao)->logException($e);

            throw $e;
        }

        return $trip;
    }


    public function cancel($tripReference, ?stdClass $driver)
    {
        $this->tripDao->updateDriver($tripReference, null);

        $this->tripScheduledDao->updateDriver($tripReference, null);

        $trip = $this->tripDao->find($tripReference);

        $this->tripRealtime->hydrate($trip)->updateTrip();

        (new RedisUtil)->set("trip-{$trip->tripReference}", $trip);

        $this->notifyCustomerBeenTripCanceledScheduled($trip->customer->deviceToken ?? null, $driver);

        return $trip;
    }

    public function getScheduled()
    {
        return [];
    }

    private function notifyCustomerBeenTripAcceptedScheduled(?string $deviceToken, ?stdClass $driver)
    {
        if (!$deviceToken) return null;

        $driverName = $driver->name ?? "Motorista";

        $pushConfig = (new PushConfigDao())->find('accepted_scheduled_trip');

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle(Config::get('app_title'))
            ->setAction(PushActionConst::NEW_NOTIFICATION_APP)
            ->setBody(str_replace('{driverType}', $driverName, $pushConfig->getMessage()));

        return $push->sendNotification();
    }

    private function notifyCustomerBeenTripCanceledScheduled(?string $deviceToken, ?stdClass $driver)
    {
        if (!$deviceToken) return null;

        $driverName = $driver->name ?? "Motorista";

        $pushConfig = (new PushConfigDao())->find('scheduled_shared_trip_canceled_by_driver');

        $push = new Push;
        $push
            ->setDeviceToken($deviceToken)
            ->setTitle(Config::get('app_title'))
            ->setBody(str_replace('{driverType}', $driverName, $pushConfig->getMessage()))
            ->setAction(PushActionConst::NEW_NOTIFICATION_APP);

        return $push->sendNotification();
    }
}