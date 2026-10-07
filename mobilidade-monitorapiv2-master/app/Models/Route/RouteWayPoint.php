<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class RouteWayPoint extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'routeWayPoint';

    public function routePitStop()
    {
        return $this->belongsTo(RoutePitStop::class, 'routePitStopId');
    }

    public function routePitStopType()
    {
        return $this->belongsTo(RoutePitStopType::class, 'routePitStopTypeId');
    }
}
