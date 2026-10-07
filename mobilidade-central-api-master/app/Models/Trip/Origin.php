<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class Origin extends Model
{
    const UPDATED_AT = null;

    protected $table = 'origin';

    protected $primaryKey = 'idOrigin';

    protected $fillable = [
        'address', 'latitude', 'longitude', 'neighborhood', 'cityId'
    ];
}
