<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:12
 */

namespace App\Repositories\Realtime;


use App\Contracts\Repository\CloudFirestoreRepository;
use App\Realtimes\Trip\Trip;
use Google\Cloud\Firestore\DocumentSnapshot;

class TripRepository extends CloudFirestoreRepository
{
    public function __construct()
    {
        parent::__construct(
            new Trip
        );
    }

    public function findAllTrips()
    {
        /** @var DocumentSnapshot[] $results */
        $results = $this->getRealtimeCollection()
            ->documents()
            ->rows();

        return array_map(function (DocumentSnapshot $trip) {
            return $trip->data();
        }, $results);
    }
}
