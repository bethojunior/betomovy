<?php

namespace app\dao;

use app\model\Notification;
use app\model\NotificationUser;
use app\utils\BaseDao;
use Exception;
use app\model\Status;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 13:46
 */
class TripScheduledDao extends BaseDao
{
    protected $table = "tripScheduled";

    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                ts.tripReference,
                ts.schedule,
                DATE_FORMAT(ts.scheduleUTC, '%Y-%m-%dT%TZ') as scheduleUTC,
                ts.driverId
            FROM {$this->table} ts
              WHERE
                ts.tripReference = :tripReference AND
                ts.statusId = 1
              ORDER BY ts.schedule DESC LIMIT 1
        ";

        $schedule = $this->sqlRawSelect($sql, [
            ':tripReference' => $tripReference
        ])
            ->get(false);

        return
            empty($schedule) ?
                null : $schedule;
    }

    public function findUpcomingTripsScheduled($schedule, $userId)
    {
        $sql = "
            SELECT
                ts.tripReference,
                ts.schedule,
                ts.driverId
            FROM tripScheduled ts
                INNER JOIN trip t on ts.tripReference = t.tripReference
                INNER JOIN config c ON c.`key` = 'scheduled_trip_interval'
              WHERE
                t.status = 'scheduled' AND
                ABS(TIMESTAMPDIFF(MINUTE, ts.schedule, :schedule)) < c.value AND
                t.userId = :userId
              ORDER BY ts.schedule DESC
        ";

        return $this->sqlRawSelect($sql, [
            ':schedule' => $schedule,
            ':userId' => $userId
        ])
            ->get();
    }

    public function findUpcomingTripsScheduledUTC($schedule, $userId)
    {
        $sql = "
            SELECT
                ts.tripReference,
                ts.schedule,
                ts.driverId
            FROM tripScheduled ts
                INNER JOIN trip t on ts.tripReference = t.tripReference
                INNER JOIN config c ON c.`key` = 'scheduled_trip_interval'
              WHERE
                t.status = 'scheduled' AND
                ABS(TIMESTAMPDIFF(MINUTE, ts.scheduleUTC, :schedule)) < c.value AND
                t.userId = :userId
              ORDER BY ts.scheduleUTC DESC
        ";

        return $this->sqlRawSelect($sql, [
            ':schedule' => $schedule,
            ':userId' => $userId
        ])
            ->get();
    }

    public function findUpcomingTripsScheduledByDriver($schedule, $driverId)
    {
        $sql = "
            SELECT
                ts.tripReference,
                ts.schedule,
                ts.driverId
            FROM tripScheduled ts
                INNER JOIN trip t on ts.tripReference = t.tripReference
                INNER JOIN config c ON c.`key` = 'scheduled_trip_interval'
              WHERE
                t.status = 'scheduled' AND
                ABS(TIMESTAMPDIFF(MINUTE, ts.schedule, :schedule)) < c.value AND
                ts.driverId = :driverId
              ORDER BY ts.schedule DESC
        ";

        return $this->sqlRawSelect($sql, [
            ':schedule' => $schedule,
            ':driverId' => $driverId
        ])
            ->get();
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @return bool
     * @throws Exception
     */
    public function updateDriver($tripReference, $driverId)
    {
        $bind = [':tripReference' => $tripReference];

        if ($driverId)
            $bind[':driverId'] = $driverId;

        return $this->sqlUpdate(
            ['driverId' => (!$driverId) ? 'NULL' : ':driverId'],
            [['tripReference', '=', ':tripReference']],
            $bind);
    }

    public function getAll()
    {
        $sql = "
            SELECT
                ts.tripReference,
                ts.schedule,
                ts.scheduleUTC,
                t.driverId,
                t.status,
                t.userId
            FROM {$this->table} ts
              INNER JOIN trip t ON t.tripReference = ts.tripReference
            WHERE
              ts.statusId = :status AND
              t.status = :tripScheduledStatus
            ORDER BY ts.schedule
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':tripScheduledStatus' => Trip::SCHEDULED,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }


    public function insertNotificationByDriverId($driverId)
    {
        $sql = /** @lang sql */ "
            SELECT
                d.userId
            FROM driver d
              INNER JOIN user u ON u.idUser = d.userId
            WHERE
                d.idDriver = :driverId
        ";

        $bind = [':driverId' => $driverId];

        $user = $this->sqlRawSelect($sql, $bind)
            ->get();

        if(empty($user))
            return true;

        return $this->sendBellNotification($user[0]->userId);
    }

    public function sendBellNotification($userId)
    {
        $notification = new Notification();

        $notification
            ->setTitle('Viagem agendada')
            ->setMessage('Você tem uma viagem agendada para daqui a pouco')
            ->setLink(null)
            ->setImage(null)
            ->setNotificationTypeId(2)
            ->setDate(now())
            ->setDateSend(null)
            ->setUserTypeId(2)
            ->setStatusId(1)
            ->setUserIdAdministrator(null)
            ->setUsersId(null)
            ->setCityId(null)
            ->setIdentifyUserInLink(0);

        $idNotification = (new NotificationDao)->sqlInsert($notification);

        return $this->sendNotificationToUser($idNotification, $userId);
    }

    public function sendNotificationToUser($idNotification, $userId)
    {
        $notificationUser = new NotificationUser();

        $notificationUser
            ->setUserId($userId)
            ->setNotificationId($idNotification)
            ->setViewed(0)
            ->setCreated_at(now());

        return (new NotificationUserDao)->sqlInsert($notificationUser);
    }
}