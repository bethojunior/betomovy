<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    const UPDATED_AT = null;

    protected $table = 'destination';

    protected $primaryKey = 'idDestination';

    protected $fillable = [
        'address', 'latitude', 'longitude', 'neighborhood', 'cityId'
    ];
}
