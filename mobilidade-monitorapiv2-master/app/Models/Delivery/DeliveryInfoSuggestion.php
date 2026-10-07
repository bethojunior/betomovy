<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;

class DeliveryInfoSuggestion extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'deliveryInfoSuggestion';

    protected $fillable = [
        'obsOrigin', 'obsDestination', 'obs', 'statusId'
    ];
}
