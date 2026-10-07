<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:14
 */

namespace App\Repositories\Realtime;

use App\Contracts\Repository\CloudFirestoreRepository;

class ChatFirestoreRepository extends CloudFirestoreRepository
{
    protected $collection = 'messagesChatTrip';

    public function __construct()
    {
        parent::__construct();
    }
}
