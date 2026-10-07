<?php

namespace app\services;

use app\dao\BlacklistUserConfigDao;
use app\dao\BlacklistUserDao;
use app\utils\Headers;
use app\model\BlacklistUser;
use app\model\BlacklistUserConfig;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/01/2019
 * Time: 15:16
 */
class BlacklistUserService
{
    private $configDao;
    private $dao;

    public function __construct()
    {
        $this->dao = new BlacklistUserDao;
        $this->configDao = new BlacklistUserConfigDao;
    }

    public function insertByPenaltiesQuantity(array $penalties): ?BlacklistUser
    {
        $timeToSuspend = $this->getTimeToSuspendByPenaltiesNumber(count($penalties));

        if (is_numeric($timeToSuspend)) {
            $blacklistUser = $this->create($timeToSuspend);
            return $blacklistUser;
        }

        return null;
    }

    private function getTimeToSuspendByPenaltiesNumber($number)
    {
        $config = new BlacklistUserConfig($this->configDao
            ->getByPenaltiesNumber($number));

        if (is_null($config->getPenaltiesQuantity()))
            return 0;

        if ($config->getPenaltiesQuantity() == $number)
            return $config->getTimeToSuspend();

        return null;
    }

    private function create($timeToSuspend, $userId = null): BlacklistUser
    {
        $blacklistUser = new BlacklistUser;
        $blacklistUser
            ->setUserId($userId ?? Headers::getUserId())
            ->setTimeSuspended($timeToSuspend)
            ->setExpirationTime(
                $timeToSuspend === 0 ? null :
                    addSeconds($blacklistUser->getCreatedAt(), (int)$timeToSuspend)
            )
            ->setIdBlacklistUser(
                $this->dao
                    ->sqlInsert($blacklistUser)
            );

        return $blacklistUser;
    }
}