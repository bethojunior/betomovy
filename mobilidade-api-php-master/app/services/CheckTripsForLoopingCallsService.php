<?php

namespace app\services;

use app\dao\TripDao;

class CheckTripsForLoopingCallsService
{
    private $tripDao;

    public function __construct()
    {
        $this->tripDao = new TripDao();
    }

    public function checkAndMarkLoopingTrips(): void
    {
        $loopingTrips = $this->tripDao->findTripsSearchingTooLong(10);
        if (empty($loopingTrips)) return;

        foreach ($loopingTrips as $trip) {
            try {
                $this->tripDao->updateStatus('not_answered', $trip->tripReference);
            } catch (\Exception $e) {
                echo $e->getMessage() . $e->getFile() . "\n";
            }
        }
    }
}
