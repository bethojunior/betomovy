<?php

namespace app\commands;

use app\services\CallTripScheduledService;
use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 15:36
 */
class CallTripScheduledCommand extends Command
{
    private $service;

    public function __construct($params = null)
    {
        writeLn("Iniciando conexão");
        parent::__construct($params);
        writeLn("Conexão aberta");
        $this->service = new CallTripScheduledService;
    }

    public function handle(): void
    {
        $this->service->findAndCallScheduled();
        $this->service->findBidTrip();
    }
}