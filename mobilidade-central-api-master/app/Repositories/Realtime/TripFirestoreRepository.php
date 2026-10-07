<?php

namespace App\Repositories\Realtime;

use App\Contracts\Repository\CloudFirestoreRepository;

class TripFirestoreRepository extends CloudFirestoreRepository
{
    protected $collection = 'trips';

    public function __construct()
    {
        parent::__construct();
    }
}
