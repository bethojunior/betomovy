<?php

namespace App\Models\Trip\Ride;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ride extends Model
{
    protected $table = 'ride';

    public function riders(): HasMany
    {
        return $this->hasMany(Rider::class, 'rideId');
    }
}
