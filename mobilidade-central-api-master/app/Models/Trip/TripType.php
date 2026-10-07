<?php

namespace App\Models\Trip;

use App\Models\Central\CentralNeighborhood;
use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;

class TripType extends Model
{
    protected $table = 'tripType';

    protected $primaryKey = 'idTripType';

    public function driversType()
    {
        return $this->belongsToMany(
            UserType::class,
            'tripTypeDriver',
            'tripTypeId',
            'userTypeId',
            'idTripType',
            'idUserType');
    }

    public function centralNeighborhood()
    {
        return $this->belongsTo(CentralNeighborhood::class,"idTripType","tripTypeId");
    }
}
