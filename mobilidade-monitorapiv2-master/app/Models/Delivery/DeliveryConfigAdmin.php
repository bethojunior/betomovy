<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;

class DeliveryConfigAdmin extends Model
{
    protected $fillable = [
        'linkAndroid',
        'linkIos',
        'image',
        'cities',
    ];

    protected $table = 'configDeliveryAdm';
}
