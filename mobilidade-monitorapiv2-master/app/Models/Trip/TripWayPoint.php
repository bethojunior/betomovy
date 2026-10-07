<?php

namespace App\Models\Trip;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class TripWayPoint extends Model
{
    const UPDATED_AT = null;

    protected $table = 'tripWayPoint';

    protected $fillable = [
        'address', 'latitude', 'longitude', 'neighborhood', 'cityId'
    ];

    public function trip()
    {
        return $this->belongsTo(
            Trip::class, 'tripReference', 'tripReference');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
