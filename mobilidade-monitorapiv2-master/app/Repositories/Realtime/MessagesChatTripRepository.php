<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:14
 */

namespace App\Repositories\Realtime;


use App\Contracts\Repository\CloudFirestoreRepository;
use App\Realtimes\Chat\MessagesChatTrip;

class MessagesChatTripRepository extends CloudFirestoreRepository
{
    public function __construct()
    {
        parent::__construct(new MessagesChatTrip);
    }

    public function deleteByTripReference($tripReference)
    {
        return
            $this->deleteMany('tripReference', '=', $tripReference);
    }
}
