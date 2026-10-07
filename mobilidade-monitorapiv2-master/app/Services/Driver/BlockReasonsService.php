<?php

namespace App\Services\Driver;

use App\Constants\Push\PushActionConst;
use App\Constants\StatusConst;
use App\Constants\Users\DriverConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Helpers\Config\ConfigHelper;
use App\Models\Driver\BlockReasons;
use App\Models\User\Driver;
use App\Repositories\User\UserRepository;
use App\Utils\Push;

class BlockReasonsService
{

    /**
     * @var ConfigHelper
     */
    private $helper;
    /**
     * @var UserRepository
     */
    private $userRepository;

    public function __construct(
        ConfigHelper $helper,
        UserRepository $userRepository
    ){
        $this->helper = $helper;
        $this->userRepository = $userRepository;
    }

    public function insert(Driver $driver, array $request): Driver
    {
        foreach ($request['blockReasonsTypeIds'] as $blockReasonTypeID) {
            BlockReasons::create([
                'blockReasonsTypeId' => $blockReasonTypeID,
                'driverId'           => $driver->idDriver,
                'statusId'           => StatusConst::ACTIVE
            ]);
        }

        $driver->driverRegisterStatusId = DriverRegisterStatusConst::BLOCKED;
        $driver->status                 = DriverConst::OFF;
        $driver->save();

        $user = $this->userRepository
            ->find($driver->userId);

        $this->notify(
            "Bloqueio",
            "Sua conta foi bloqueada",
            $user->deviceToken
        );

        return $driver;
    }

    private function notify($title, $message, $deviceToken)
    {
        $push = new Push(
            $this->helper->get('firebase_api_key'));

        $push
            ->setTitle($title)
            ->setBody($message)
            ->setAction(PushActionConst::UPDATE_STATUS_DOCUMENTS)
            ->setDeviceToken($deviceToken);

        return $push->sendNotificationWithData();
    }
}
