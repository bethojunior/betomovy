<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class ScheduleCorporateRouteWeek extends Model
{
    protected $table = "scheduleCorporateRouteWeek";

    protected $fillable = [
        'day',
        'scheduleCorporateRouteId'
    ];
}
