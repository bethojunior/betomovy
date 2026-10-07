<?php

namespace App\Services\Config;

use App\Constants\Trip\TripConst;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Repositories\Realtime\TripRepository as RealtimeRepository;
use App\Utils\UUID;

class FirestoreService
{

    /**
     * @var RealtimeRepository
     */
     private $realtimeRepository;

     public function __construct(RealtimeRepository $realtimeRepository)
     {
         $this->realtimeRepository = $realtimeRepository;
     }

    public function cleanAllCollection()
    {
        $this->realtimeRepository->deleteAll();
    }

    public function checkRealtime()
    {
        $tripReference = UUID::v4();

        $tripRealtime = new RealtimeTrip;
        $tripRealtime
            ->mount((object)[
                'status' => TripConst::ACCEPTED,
                'tripReference' => $tripReference
            ]);
        $this->realtimeRepository
            ->setRealtime($tripRealtime)
            ->save();

        $this->realtimeRepository->findAllTrips();
        $this->realtimeRepository->deleteMany('tripReference', '=', $tripReference);
    }
}
