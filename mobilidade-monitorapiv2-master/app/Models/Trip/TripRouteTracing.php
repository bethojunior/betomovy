<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class TripRouteTracing extends Model
{
    protected $table      = 'tripRouteTracing';
    protected $primaryKey = 'id';
    public    $timestamps = false;

    protected $fillable = ['tripReference', 'tracing'];
}
