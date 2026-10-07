<?php

namespace App\Models\Monetization;

use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class ReferralMonetization extends Model
{
    protected $table = 'referralMonetization';

    protected $fillable = [
        'label', 'indications', 'value', 'valueType', 'cityId'
    ];

    public function tripTypes()
    {
        return $this->belongsToMany(
            TripType::class,
            'referralMonetizationTripType',
            'referralMonetizationId',
            'tripTypeId')
            ->withPivot([
                'value', 'valueType'
            ]);
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
