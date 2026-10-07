<?php

namespace App\Models\Route;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class RouteDriverAccepted extends Model
{
    protected $table = 'routeDriverAccepted';

    public function route()
    {
        return $this->belongsTo(Route::class, 'routeId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
