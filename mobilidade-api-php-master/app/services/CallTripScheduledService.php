<?php

namespace app\services;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\dao\CustomerDao;
use app\dao\DriverDao;
use app\dao\PushConfigDao;
use app\dao\TripBidDao;
use app\dao\TripScheduledDao;
use app\model\Config;
use app\model\Trip;
use app\realtime\TripRealtime;
use app\utils\Push;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 15:51
 */
class CallTripScheduledService
{

    private $tripScheduledDao;
    private $tripRealtime;
    private $timeToNotifyDriverTripScheduled;
    private $pushConfigDao;
    private $timeToCallDriverTripScheduledInSeconds;
    private $timeToCancelTripBidInSeconds;
    private $tripBidDao;

    public function __construct()
    {
        $this->tripScheduledDao = new TripScheduledDao;
        $this->tripRealtime = new TripRealtime;
        $this->pushConfigDao = new PushConfigDao;
        $this->tripBidDao = new TripBidDao;
    }

    /**
     * @throws Exception
     */
    public function findAndCallScheduled()
    {
        $this->startConfigs();

        $trips = $this->tripScheduledDao
            ->getAll();

        $now = now();

        $nowUTC = gmdate('Y-m-d H:i:s', strtotime(now()));

        foreach ($trips as $trip) {
            try {
                if ($trip->scheduleUTC) {
                    if (
                        diffInMinutes($nowUTC, $trip->scheduleUTC) == $this->timeToNotifyDriverTripScheduled &&
                        $trip->driverId) {
                        $this->tripScheduledDao->insertNotificationByDriverId($trip->driverId);
                        $this->notifyDriverNearCallTime($trip->driverId);
                        continue;
                    }
                } else {
                    if (
                        diffInMinutes($now, $trip->schedule) == $this->timeToNotifyDriverTripScheduled &&
                        $trip->driverId) {
                        $this->tripScheduledDao->insertNotificationByDriverId($trip->driverId);
                        $this->notifyDriverNearCallTime($trip->driverId);
                        continue;
                    }
                }

                if (!dateIsBefore($trip->schedule, $now) && !$trip->driverId) {
                    continue;
                }

                if (!$trip->driverId) {
                    $this->expireTrip($trip->tripReference, $trip->userId);
                    writeLn("Chamada: {$trip->tripReference} expirada");
                    continue;
                }

                if ($trip->scheduleUTC) {
                    if (diffInSeconds($nowUTC, $trip->scheduleUTC) <= $this->timeToCallDriverTripScheduledInSeconds) {
                        $this->callDriver($trip->driverId, $trip->tripReference);
                        writeLn("Motorista {$trip->driverId} chamado");
                        continue;
                    }
                } else {
                    if (diffInSeconds($trip->schedule, $now) <= $this->timeToCallDriverTripScheduledInSeconds) {
                        $this->callDriver($trip->driverId, $trip->tripReference);
                        writeLn("Motorista {$trip->driverId} chamado");
                    }
                }

            } catch (Exception $e) {
                echo $e->getMessage() . $e->getFile();

                continue;
            }
        }
    }

    public function findBidTrip()
    {
        $this->startConfigs();

        $trips = $this->tripBidDao
            ->getAllBidByDrivers();

        $now = now();

        foreach ($trips as $trip) {
            try {
                if (diffInSeconds($now, $trip->tripDate) > $this->timeToCancelTripBidInSeconds) {
                    $this->expireBidTrip($trip->tripReference, $trip->userId);
                    writeLn("Chamada: {$trip->tripReference} expirada");
                }
            } catch (Exception $e) {
                echo $e->getMessage() . $e->getFile();

                continue;
            }
        }
    }

    private function startConfigs()
    {
        $this->timeToNotifyDriverTripScheduled = Config::get('time_to_notify_driver_trip_scheduled');
        $this->timeToCallDriverTripScheduledInSeconds = Config::get('time_to_call_driver_trip_scheduled_in_seconds');
        $this->timeToCancelTripBidInSeconds = Config::get('time_to_cancel_trip_bid_in_seconds');
    }

    /**
     * @param $tripReference
     * @param $userId
     * @throws Exception
     */
    private function expireTrip($tripReference, $userId)
    {
        (new CustomerDao)
            ->cancelTrip($tripReference, now(), $userId, Trip::NOT_ANSWERED, true);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();
    }

    /**
     * @param $tripReference
     * @param $userId
     * @return void
     * @throws Exception
     */
    private function expireBidTrip($tripReference, $userId)
    {
        (new CustomerDao)
            ->cancelTrip($tripReference, now(), $userId, Trip::NOT_ANSWERED);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();
    }

    /**
     * @param $driverId
     * @param $tripReference
     * @throws Exception
     */
    private function callDriver($driverId, $tripReference)
    {
        $driverDao = new DriverDao;

        $driverDao->acceptTrip(
            (object)compact('driverId', 'tripReference'), true);

        $driver = $driverDao->find($driverId, false);

        $this->notifyDriver($driver->deviceToken);
    }

    private function notifyDriver($deviceToken)
    {
        $push = new Push();
        $push
            ->setTitle(strtoupper(Config::get('app_title') ?? 'CHAMAMENTO EM BREVE'))
            ->setBody("Seu chamado agendado iniciou!!")
            ->setAction(PushActionConst::OPEN_APP)
            ->setTag(PushTagConst::SCHEDULED_RIDE)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        $push->notificationAllWithData([$deviceToken]);

        sleep(3);

        $push->notificationAllWithData([$deviceToken]);

        return true;
    }

    /**
     * @param $driverId
     * @return mixed
     * @throws Exception
     */
    private function notifyDriverNearCallTime($driverId)
    {
        $pushConfig = $this->pushConfigDao
            ->find('driver_notification_near_call_time');

        $driverDao = new DriverDao;

        $appName = Config::get('app_title');

        $push = new Push();
        $push
            ->setTitle(str_replace('{appName}', $appName, $pushConfig->getTitle()))
            ->setMessage($pushConfig->getMessage())
            ->setAction(PushActionConst::NEW_NOTIFICATION_APP)
            ->setTag(PushTagConst::DRIVERS_CLOSE)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setBody($pushConfig->getMessage());

        $driver = $driverDao->find($driverId, false);

        $push
            ->sendNotificationWithData([$driver->deviceToken]);

        return true;
    }
}