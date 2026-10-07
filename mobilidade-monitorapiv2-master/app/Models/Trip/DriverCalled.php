<?php

namespace App\Models\Trip;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class DriverCalled extends Model
{
    protected $table = 'driverCalled';

    protected $fillable = [
        'driverId',
        'tripReference',
        'proximity',
        'destinationProximity'
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
