<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $table = 'zone';

    protected $primaryKey = 'idZone';

    protected $fillable = [
        'radius', 'centralId', 'greaterRadius'
    ];
}
