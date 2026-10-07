<?php

namespace app\services;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\DocUserConst;
use app\constant\UserGroupConst;
use app\dao\AdminNotificationDao;
use app\dao\AdminNotificationTypeDao;
use app\dao\DocUserDao;
use app\dao\UserDao;
use app\model\DocUser;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 11:40
 */
class DocUserService
{
    /**
     * @var DocUserDao
     */
    private $dao;
    private $adminNotificationTypeDao;
    private $userDao;

    public function __construct()
    {
        $this->dao = new DocUserDao;
        $this->adminNotificationTypeDao = new AdminNotificationTypeDao;
        $this->userDao = new UserDao;
    }

    public function find($userId)
    {
        return $this->dao
            ->findByUser($userId);
    }

    /**
     * @param $userId
     * @param array $request
     * @param array $files
     * @return array
     * @throws Exception
     */
    public function send($userId, array $request, array $files)
    {
        if (!isset($request['docId']))
            throw new Exception("Documento não foi informado");

        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        $adminNotificationType = $this->adminNotificationTypeDao
            ->find(AdminNotificationTypeConst::NEW_DOCUMENT_SENT);

        $user = $this->userDao->find($userId, ['idUser', 'name']);
        
        // Detectar se é motorista verificando se existe na tabela driver
        $driverDao = new \app\dao\DriverDao();
        $isDriver = $driverDao->findByUserId($userId, false) !== null;
        
        $userGroupId = $isDriver ? UserGroupConst::DRIVER : UserGroupConst::CLIENT;

        $message = str_replace('{userName}', $user->name, $adminNotificationType->defaultMessage);

        $docUser = $this->dao
            ->findByUserAndDoc($userId, $request['docId']);

        if (!$docUser) {
            $docUser = [
                'userId' => $userId,
                'docId' => $request['docId'],
                'text' => $request['text'] ?? null,
                'docStatusId' => DocUserConst::IN_ANALYSIS,
                'statusId' => 1
            ];
        }

        $docUser = new DocUser($docUser);
        $docUser
            ->setUserId($userId) // Garantir que userId está definido
            ->setText($request['text'] ?? $docUser->getText())
            ->setDocStatusId(DocUserConst::IN_ANALYSIS);

        if (isset($files["DOC_{$request['docId']}"])) {
            $docUser->setImage($files["DOC_{$request['docId']}"]);
        }

        if (isset($files["PDF_{$request['docId']}"])) {
            $docUser->setPdf($files["PDF_{$request['docId']}"]);
        }

        if ($docUser->getId()) {
            $docUser = $this->update($docUser);
        } else {
            $docUser->setId($this->dao->sqlInsert($docUser));
        }

        $adminNotification = new AdminNotification();
        $adminNotification
            ->setUserId($userId)
            ->setIp($ip)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::NEW_DOCUMENT_SENT)
            ->setLat($request->lat ?? null)
            ->setLng($request->lng ?? null)
            ->setUserGroupId($userGroupId)
            ->setMessage($message)
            ->setTitle($adminNotificationType->name)
            ->setTripReference($trip->tripReference ?? null)
            ->setEmergencyMonitoringTypeId($request->emergencyMonitoringTypeId ?? null)
            ->setCityId($trip->cityId ?? $driver->cityId ?? null)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));

        return $docUser->extract();
    }

    /**
     * @param DocUser $docUser
     * @return DocUser
     * @throws Exception
     */
    private function update(DocUser $docUser): DocUser
    {
        $set = [];
        $bind = [];

        foreach ($docUser->extract() as $key => $value) {
            if ($value) {
                if ($key != 'id')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        $this->dao
            ->sqlUpdate($set, [['id', '=', ':id']], $bind);

        return $docUser;
    }
}