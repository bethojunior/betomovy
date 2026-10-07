<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class CityConfig extends Model
{
    protected $table = 'cityConfig';

    public function cityArea()
    {
        return $this->belongsTo(CityArea::class, 'cityId', 'cityId');
    }
}
