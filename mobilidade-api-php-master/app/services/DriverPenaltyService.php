<?php

namespace app\services;

use app\constant\PushActionConst;
use app\constant\PushTagConst;
use app\constant\UserPenaltyConst;
use app\dao\DriverDao;
use app\dao\MessagesChatTripDao;
use app\dao\UserDao;
use app\exceptions\PushException;
use app\utils\Push;
use app\model\Config;
use app\model\ConfigType;
use app\model\DriverRegisterStatus;
use Exception;
use app\model\TripCancellationCustomerFee;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/01/2019
 * Time: 09:33
 */
class DriverPenaltyService
{
    private $penaltyService;
    private $pushTitle;
    private $pushBody;
    private $messagesChatDao;

    public function __construct()
    {
        $this->penaltyService = new UserPenaltyService;
        $this->messagesChatDao = new MessagesChatTripDao;
    }

    /**
     * Inserir cancelamento pelo usuário
     * @param $userId
     * @param $tripReference
     * @param null|\app\model\TripCancellationCustomerFee $customerCancelFee
     * @throws Exception
     */
    public function insertByCancellation($userId, $tripReference, ?TripCancellationCustomerFee $customerCancelFee)
    {
        $messagesChat = $this->messagesChatDao
            ->getMessagesByTrip($tripReference, $userId);

        if (empty($messagesChat) && !$customerCancelFee) {
            $this->penaltyService
                ->insert(UserPenaltyConst::TRIP_CANCELED);

            $blacklist = $this->penaltyService
                ->manageUserBlacklist();

            if ($blacklist)
                $this->blockDriver($userId);
        }
    }

    /**
     * @param $userId
     * @throws Exception
     */
    public function insertByRefuse($userId)
    {
        $this->penaltyService
            ->updatePerformanceGrade($userId, UserPenaltyConst::TRIP_REFUSED);
    }

    /**
     * @param $userId
     * @throws Exception
     */
    public function insertByNotAnswer($userId)
    {
        $this->penaltyService
            ->updatePerformanceGrade($userId, UserPenaltyConst::TRIP_NOT_ANSWERED);
    }

    /**
     * Bloquear motorista pelo usuário
     * @param $userId
     * @return bool
     * @throws Exception
     */
    private function blockDriver($userId)
    {
        $driverDao = new DriverDao;

        $this->notifyOnBlockDriver($userId);

        return $driverDao
            ->updateDriverRegisterUserId($userId, DriverRegisterStatus::BLACKLIST);
    }

    /**
     * @param $userId
     * @return mixed
     * @throws PushException
     */
    private function notifyOnBlockDriver($userId)
    {
        $this->loadPushData();

        $userDao = new UserDao;
        $user = $userDao->find($userId);

        $push = new Push;
        $push
            ->setTitle($this->pushTitle)
            ->setBody($this->pushBody)
            ->setAction(PushActionConst::UPDATE_DRIVER_INFO)
            ->setTag(PushTagConst::UPDATE_DRIVER_INFO)
            ->setDeviceToken($user->deviceToken);

        return $push->sendNotification();
    }

    private function loadPushData(): void
    {
        $this->pushTitle = Config::get('title_start_blacklist_push', ConfigType::BLACKLIST);
        $this->pushBody = Config::get('body_start_blacklist_push', ConfigType::BLACKLIST);
    }
}