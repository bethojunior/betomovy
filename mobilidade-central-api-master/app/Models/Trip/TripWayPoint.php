<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class TripWayPoint extends Model
{
    const UPDATED_AT = null;

    protected $table = 'tripWayPoint';

    protected $fillable = [
        'address', 'latitude', 'longitude', 'neighborhood', 'cityId', 'obs'
    ];

    public function trip()
    {
        return $this->belongsTo(
            Trip::class, 'tripReference', 'tripReference');
    }
}
