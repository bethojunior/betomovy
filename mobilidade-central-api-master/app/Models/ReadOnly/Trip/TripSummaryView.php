<?php

namespace App\Models\ReadOnly\Trip;

use App\Models\ReadOnly\User\CustomerRO;
use App\Models\ReadOnly\User\DriverRO;
use Illuminate\Database\Eloquent\Model;

class TripSummaryView extends Model
{
    protected $table = 'trip_summary_view';

    protected $connection = 'mysql_ro';

    protected $dates = [
        'date', 'endDate'
    ];

    public function customer()
    {
        return $this->belongsTo(CustomerRO::class, 'userId', 'userId');
    }

    public function driver()
    {
        return $this->belongsTo(DriverRO::class, 'driverId');
    }

    public function driversCalled()
    {
        return $this->hasMany(DriverCalledRO::class, 'tripReference', 'tripReference');
    }
}
