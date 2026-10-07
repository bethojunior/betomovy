<?php

namespace App\Models\Driver;

use Illuminate\Database\Eloquent\Model;

class DriverSplitConfig extends Model
{
    protected $table = 'driverSplitConfig';

    protected $fillable = [
        'driverId',
        'financialIntermediaryId',
        'externalId',
        'status',
    ];
}
