<?php

namespace App\Models\Trip;

use App\Models\Central\CentralDriver;
use Illuminate\Database\Eloquent\Model;

class DriversCloseTheTrip extends Model
{
    protected $table = 'drivers_close_the_trip_view';

    public function centralDriver()
    {
        return $this->hasMany(CentralDriver::class, 'driverId', 'idDriver');
    }
}
