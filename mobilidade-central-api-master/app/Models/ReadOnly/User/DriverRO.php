<?php

namespace App\Models\ReadOnly\User;

use App\Models\ReadOnly\Central\CentralDriverRO;
use App\Models\ReadOnly\Trip\TripRO;
use Illuminate\Database\Eloquent\Model;

class DriverRO extends Model
{
    protected $table = 'driver';

    protected $primaryKey = 'idDriver';

    protected $connection = 'mysql_ro';

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(UserRO::class, 'userId');
    }

    public function central()
    {
        return $this->hasMany(CentralDriverRO::class, 'driverId');
    }

    public function trips()
    {
        return $this->hasMany(TripRO::class, 'driverId', 'idDriver');
    }
}
