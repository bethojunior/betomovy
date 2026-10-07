<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class CityArea extends Model
{
    protected $table = 'cityArea';
    public $timestamps = false;

    protected $fillable = [
        'polygon',
        'cityId',
        'statusId'
    ];
}
