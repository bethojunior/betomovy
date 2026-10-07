<?php

namespace App\Models\Price\Range;

use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class PriceRangeWithCentral extends Model
{
    protected $table = 'priceRangeWithCentral';

    protected $fillable = [
        'priceRangeCentralId', 'centralId', 'statusId'
    ];
}
