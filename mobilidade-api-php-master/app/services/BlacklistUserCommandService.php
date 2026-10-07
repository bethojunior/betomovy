<?php

namespace app\services;

use app\constant\PushActionConst;
use app\constant\PushTagConst;
use app\dao\BlacklistUserDao;
use app\dao\DriverDao;
use app\dao\LogDao;
use app\utils\Push;
use app\model\Config;
use app\model\ConfigType;
use app\model\DriverRegisterStatus;
use Exception;
use app\model\Log;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/01/2019
 * Time: 11:42
 */
class BlacklistUserCommandService
{
    private $dao;
    private $driverDao;
    private $pushTitle;
    private $pushBody;

    public function __construct()
    {
        $this->dao = new BlacklistUserDao;
        $this->driverDao = new DriverDao;
    }

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function removeUsersOnExpiredTime()
    {
        $this->loadConfigs();

        $expireds = $this->dao
            ->findExpired();

        $expireds = array_map(function ($expired) {
            $this->remove($expired->idBlacklistUser);
            $this->updateUserRegister($expired->userTypeId, $expired->userId);
            return $expired;
        }, $expireds);

        $arrayDeviceTokens = array_map(function ($expired) {
            return $expired->deviceToken;
        }, $expireds);

        $resultPush = $this->sendPushInRemove($arrayDeviceTokens);

        if (!empty($expireds))
            $this->createLog(
                (object)[
                    'expireds' => $expireds,
                    'resultPush' => $resultPush
                ],
                "USUÁRIOS REMOVIDOS DA BLACKLIST"
            );

        return $expireds;
    }

    private function loadConfigs()
    {
        $this->pushTitle = Config::get('title_end_blacklist_push', ConfigType::BLACKLIST);
        $this->pushBody = Config::get('body_end_blacklist_push', ConfigType::BLACKLIST);
    }

    /**
     * @param $idBlacklistUser
     * @return bool
     * @throws Exception
     */
    private function remove($idBlacklistUser)
    {
        return $this->dao
            ->remove($idBlacklistUser);
    }

    /**
     * @param $userTypeId
     * @param $userId
     * @throws Exception
     */
    private function updateUserRegister($userTypeId, $userId)
    {
        switch ($userTypeId) {
            case UserType::MOTORISTA:
            case UserType::MOTORISTA_PARTICULAR:
            case UserType::MOTORISTA_RETURN:
                $this->driverDao
                    ->updateDriverRegisterUserId($userId, DriverRegisterStatus::ATIVO);
        }
    }

    private function sendPushInRemove($arrayDeviceTokens)
    {
        if (empty($arrayDeviceTokens))
            return null;

        $push = new Push;
        $push
            ->setTitle($this->pushTitle)
            ->setBody($this->pushBody)
            ->setAction(PushActionConst::UPDATE_DRIVER_INFO)
            ->setTag(PushTagConst::UPDATE_DRIVER_INFO);

        return $push
            ->notificationAllWithData($arrayDeviceTokens);
    }

    /**
     * @param $data
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createLog($data, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}