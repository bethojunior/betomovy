<?php

namespace App\Models\Price\Dynamic;

use Illuminate\Database\Eloquent\Model;

class MonitoringArea extends Model
{

    protected $table = 'monitoring_point_area';

    protected $fillable = [
        'name',
        'area',
        'active',
        'cityId'
    ];

    protected $casts = [
        'area' => 'array',
    ];
}


