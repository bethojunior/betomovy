<?php

namespace app\commands;

use app\dao\TripDao;
use app\model\Trip;
use app\realtime\MessagesChatTripRealtime;
use app\realtime\TripRealtime;
use app\realtime\TripRouteRealtime;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/11/2019
 * Time: 12:00
 */
class SyncRealtimeTripCommand extends Command
{
    /**
     * @var TripRealtime
     */
    private $tripRealtime;
    private $tripDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->tripRealtime = new TripRealtime;
        $this->tripDao = new TripDao;
    }

    public function handle(): void
    {
        // $this->findRealtimeTrips();
    }

    public function findRealtimeTrips()
    {
        // $trips = $this->tripRealtime
        //     ->findAllTrips();

        // foreach ($trips as $tripRealtime) {
        //     dd($tripRealtime['tripReference']);

        //     if (!isset($tripRealtime['tripReference']))
        //         continue;

        //     try {
        //         $this->syncTrip($tripRealtime);
        //     } catch (Exception $e) {
        //         continue;
        //     }
        // }
    }

    /**
     * @param array $tripRealtime
     * @throws Exception
     */
    private function syncTrip(array $tripRealtime)
    {
        $trip = $this->tripDao->find($tripRealtime['tripReference']);

        dd($trip);

        if (
            !in_array($trip->status, [
                Trip::SCHEDULED,
                Trip::SEARCHING,
                Trip::SEARCHING_FAVORITE,
                Trip::ACCEPTED,
                Trip::BOARDING,
                Trip::PRE_ACCEPTED,
                Trip::IN_PROGRESS,
            ])
        )
            $this->deleteRealtime($tripRealtime['tripReference']);
    }

    private function deleteRealtime($tripReference)
    {
        (new MessagesChatTripRealtime)
            ->deleteAll($tripReference);

        $this->tripRealtime
            ->setTripReference($tripReference)
            ->deleteTrip();

        (new TripRouteRealtime)
            ->setDocumentId($tripReference)
            ->delete();

        writeLn('Viagem sincronizada');
    }
}