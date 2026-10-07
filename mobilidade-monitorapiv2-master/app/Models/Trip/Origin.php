<?php

namespace App\Models\Trip;

use App\Contracts\Models\Location;

class Origin extends Location
{
    protected $table = 'origin';

    protected $primaryKey = 'idOrigin';
}
