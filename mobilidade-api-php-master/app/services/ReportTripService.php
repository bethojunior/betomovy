<?php

namespace app\services;

use app\dao\LogDao;
use app\dao\TripDao;
use app\dao\TripReportDao;
use app\utils\Connection;
use app\utils\Headers;
use Exception;
use app\model\Log;
use app\model\LogType;
use PDO;
use app\model\TripAudit;
use app\model\TripReport;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\constant\AdminNotificationTypeConst;
use app\constant\UserGroupConst;
use app\dao\UserDao;
use app\model\AdminNotification;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/01/2019
 * Time: 10:06
 */
class ReportTripService
{
    /** @var PDO $conn */
    protected $conn;
    protected $dao;
    protected $tripDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new TripReportDao;
        $this->tripDao = new TripDao;
    }

    /**
     * @param $request
     * @return \app\model\TripReport
     * @throws Exception
     */
    public function insert($request): TripReport
    {
        try {
            $this->conn
                ->beginTransaction();

            $tripReport = $this->create($request);

            $trip = $this->updateTripAudit($tripReport->getTripReference());

            $this->createLog(
                (object)[
                    'tripReport' => $tripReport->toStdClass(),
                    'trip' => $trip
                ],
                $tripReport->getTripReference(),
                "VIAGEM REPORTADA"
            );

            $this->conn
                ->commit();
        } catch (Exception $e) {
            $this->conn
                ->rollBack();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $tripReport;
    }

    protected function create($request): TripReport
    {
        $tripReport = new TripReport($request);
        $tripReport
            ->setUserId(Headers::getUserId())
            ->setIdTripReport($this->dao
                ->sqlInsert($tripReport));

        return $tripReport;
    }

    protected function createLog($data, $idReference, $message)
    {
        $log = new Log(LogType::PROCESS);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId(Headers::getUserId())
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }

    /**
     * @param string $tripReference
     * @return array|mixed
     * @throws Exception
     */
    private function updateTripAudit(string $tripReference)
    {
        $trip = $this->tripDao
            ->find($tripReference);

        if ($trip->tripAuditId == TripAudit::IN_ANALYSIS ||
            $trip->tripAuditId == TripAudit::BLOCKED) {

            $this->tripDao
                ->updateAudit($tripReference, TripAudit::IN_ANALYSIS);
            $trip->tripAuditId = TripAudit::IN_ANALYSIS;
        }

        return $trip;
    }

    protected function createAdminNotificationForTripReport($userId, $tripReference, $reportMessage)
    {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        $adminNotificationType = (new AdminNotificationTypeDao)
            ->find(AdminNotificationTypeConst::CONTACT_US_TRIP);

        $user = (new UserDao)->find($userId, ['name', 'email', 'cityId']);

        $notificationMessage = str_replace(
            ['{userName}', '{message}'],
            [$user->name, $reportMessage],
            $adminNotificationType->defaultMessage
        );

        $adminNotification = new AdminNotification;
        $adminNotification
            ->setUserId($userId)
            ->setIp($ip)
            ->setAdminNotificationTypeId($adminNotificationType->idAdminNotificationType ?? AdminNotificationTypeConst::CONTACT_US_TRIP)
            ->setUserGroupId(UserGroupConst::CLIENT)
            ->setMessage($notificationMessage)
            ->setTitle($adminNotificationType->name)
            ->setCityId($user->cityId ?? null)
            ->setTripReference($tripReference) 
            ->setId(
                (new AdminNotificationDao)->sqlInsert($adminNotification)
            );
    }
}