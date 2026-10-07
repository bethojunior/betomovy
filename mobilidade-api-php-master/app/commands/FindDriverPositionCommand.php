<?php

namespace app\commands;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\dao\DriverActiveDao;
use app\utils\Command;
use app\utils\Push;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2020
 * Time: 15:24
 */
class FindDriverPositionCommand extends Command
{
    /**
     * @var DriverActiveDao
     */
    private $dao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->dao = new DriverActiveDao;
    }

    public function handle(): void
    {
        $drivers = $this->dao->findAllActives();

        $arrayDrivers = array_chunk($drivers, 500);

        $result = [];

        foreach ($arrayDrivers as $drivers) {
            $result[] = $this->sendTripNotifications(array_map(function ($driver) {
                return $driver->deviceToken;
            }, $drivers));
        }

        $this->response = $result;
    }

    public function sendTripNotifications(array $deviceTokens)
    {
        $deviceTokens = array_filter($deviceTokens);

        $push = new Push;
        $push
//            ->setTitle('asd')
//            ->setBody('asd')
            ->setAction(PushActionConst::SHOW_POSITION)
//            ->setTag(PushTagConst::DRIVERS_CLOSE)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        return $push->notificationAllWithData($deviceTokens);
    }
}