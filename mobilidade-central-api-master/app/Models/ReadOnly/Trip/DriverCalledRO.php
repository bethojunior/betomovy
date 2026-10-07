<?php

namespace App\Models\ReadOnly\Trip;

use App\Models\ReadOnly\User\DriverRO;
use Illuminate\Database\Eloquent\Model;

class DriverCalledRO extends Model
{
    protected $table = 'driverCalled';

    protected $connection = 'mysql_ro';

    protected $fillable = [
        'driverId',
        'tripReference',
        'proximity',
        'destinationProximity'
    ];

    public function driver()
    {
        return $this->belongsTo(DriverRO::class, 'driverId');
    }
}
