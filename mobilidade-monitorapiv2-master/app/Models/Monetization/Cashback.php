<?php

namespace App\Models\Monetization;

use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class Cashback extends Model
{
    protected $table = 'cashback';

    protected $fillable = [
        'value',
        'valueType',
        'addToFinalPrice',
        'backToTripBalance',
        'cityId',
        'tripTypeId',
        'active',
    ];

    protected $hidden = ['statusId'];

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }
}
