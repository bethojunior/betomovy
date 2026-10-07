<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class DeliveryInfo extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'deliveryInfo';

    protected $fillable = [
        'tripReference',
        'obsOrigin',
        'obsDestination',
        'obs',
    ];
}
