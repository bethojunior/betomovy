<?php

namespace App\Repositories\Trip;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripScheduled;

class TripScheduledRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TripScheduled::class);
    }
}
