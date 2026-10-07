<?php

namespace App\Models\Price\Range;

use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class PriceRange extends Model
{
    protected $table = 'priceRange';

    protected $fillable = [
        'min_value',
        'max_value',
        'new_value',
        'tripTypeId',
        'cityId',
        'description'
    ];

    protected $hidden = ['statusId', 'priceId'];

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
