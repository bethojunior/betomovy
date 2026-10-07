<?php


namespace app\commands;

use app\dao\TripDao;
use app\services\QueueFinishedTripService;
use app\utils\Command;

class QueueFinishedTripCommand extends Command
{
    private $tripDao;
    private $queueFinishedTripService;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->tripDao = new TripDao;
        $this->queueFinishedTripService = new QueueFinishedTripService;
    }

    public function handle(): void
    {
        $tripReference = $this->params[2] ?? '';

        $trip = $this->tripDao->findFully($tripReference);
        $this->queueFinishedTripService->newTrip($trip);
    }
}