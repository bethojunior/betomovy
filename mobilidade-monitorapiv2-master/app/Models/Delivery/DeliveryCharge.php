<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;

class DeliveryCharge extends Model
{
    protected $table = 'deliveryCharge';

    protected $fillable = [
        'monthlyFixedValue',
        'monthlyFixedDay',
        'orderFixedValue',
        'orderPercentageValue',
    ];
}
