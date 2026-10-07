<?php

namespace app\commands;

use app\services\CheckTripsForLoopingCallsService;
use app\utils\Command;

class CheckTripsForLoopingCallsCommand extends Command
{
    private $service;

    public function __construct()
    {
        $this->service = new CheckTripsForLoopingCallsService();
    }

    public function handle(): void
    {
        $this->service->checkAndMarkLoopingTrips();
    }
}
