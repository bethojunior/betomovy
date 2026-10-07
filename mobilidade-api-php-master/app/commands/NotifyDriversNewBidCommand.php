<?php

namespace app\commands;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\constant\PushTagConst;
use app\dao\DriverDao;
use app\utils\Command;
use app\utils\Push;

class NotifyDriversNewBidCommand extends Command
{
    public function handle(): void
    {
        $tripReference = $this->params[2] ?? '';

        $drivers = (new DriverDao)->findDriversByTrip($tripReference);

        $tokens = array_map(function ($driver) {
            return $driver->deviceToken;
        }, $drivers);

        $push = new Push();
        $push
            ->setTitle("Nova oferta")
            ->setBody('Nova solicitação próximo de você!')
            ->setAction(PushActionConst::OPEN_APP)
            ->setTag(PushTagConst::RIDE_OFFER)
            ->setForceStart(PushConst::FORCE_START)
            ->setPriority(PushConst::HIGH_PRIORITY);

        $push->notificationAllWithData($tokens);
    }
}