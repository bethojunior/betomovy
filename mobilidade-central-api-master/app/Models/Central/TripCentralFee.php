<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class TripCentralFee extends Model
{
    protected $table = 'tripCentralFee';

    protected $fillable = [
        'tripId',
        'centralFee'
    ];

    const CREATED_AT = null;
    const UPDATED_AT = null;

}
