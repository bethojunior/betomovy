<?php

namespace App\Models\Route;

use Illuminate\Database\Eloquent\Model;

class RoutePitStop extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'routePitStop';

    protected $fillable = [
        'routeId',
        'tag',
        'complement',
        'latitude',
        'longitude',
        'address',
    ];
}
