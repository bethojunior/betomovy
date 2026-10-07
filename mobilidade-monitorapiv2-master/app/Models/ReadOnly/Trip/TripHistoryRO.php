<?php

namespace App\Models\ReadOnly\Trip;

use Illuminate\Database\Eloquent\Model;

class TripHistoryRO extends Model
{
    protected $table = 'tripHistory';

    protected $primaryKey = 'idTripHistory';

    protected $connection = 'mysql_ro';
}
