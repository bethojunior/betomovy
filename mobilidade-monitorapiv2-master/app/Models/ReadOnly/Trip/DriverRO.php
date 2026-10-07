<?php

namespace App\Models\ReadOnly\Trip;

use Illuminate\Database\Eloquent\Model;

class DriverRO extends Model
{
    protected $table = 'driver';

    protected $primaryKey = 'idDriver';

    protected $connection = 'mysql_ro';

    const UPDATED_AT = null;

    public function trips()
    {
        return $this->hasMany(TripRO::class, 'driverId', 'idDriver');
    }

    public function tripHistory()
    {
        return $this->hasMany(TripHistoryRO::class, 'driverId');
    }
}
