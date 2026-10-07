<?php

namespace App\Models\Trip;

use App\Contracts\Models\Location;

class Destination extends Location
{
    protected $table = 'destination';

    protected $primaryKey = 'idDestination';
}
