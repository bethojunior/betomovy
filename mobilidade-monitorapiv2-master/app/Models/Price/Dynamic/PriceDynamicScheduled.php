<?php

namespace App\Models\Price\Dynamic;

use Illuminate\Database\Eloquent\Model;

class PriceDynamicScheduled extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'priceDynamicScheduled';

    protected $fillable = [
        'cityId',
        'tripTypeId',
        'multiplierValue',
        'tag',
        'startDate',
        'endDate',
        'startDateUTC',
        'endDateUTC'
    ];
}
