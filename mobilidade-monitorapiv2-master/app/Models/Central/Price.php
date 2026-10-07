<?php

namespace App\Models\Central;

use App\Models\Trip\TripType;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $table = 'price';

    protected $fillable = [
        'min_price',
        'base_price',
        'km_price',
        'minute_price',
        'tax_price',
        'tax_price_type',
        'another_fee',
        'another_fee_type',
        'waypoint_price',
        'tag',
        'color',
        'idealListCommonPrice',
        'tripTypeId',
        'cityId',
        'tax_price_description',
        'another_fee_description',
        'long_distance_per_km',
        'long_distance_value_to_final_price',
        'long_distance_radius',
        'disable_after_km',
        'promotional_price_temp',
        'reward_driver_min_price',
        'type_additional_value_after_km',
        'km_to_additional_value',
        'additional_value_after_km',
        'long_distance_delivery_price',
        'centralId',
        'waiting_tolerance_seconds' ,
        'waiting_extra_fee_per_minute',
        'waiting_penalty_fee',
        'order',
        'percentage_min_offer',
        'percentage_max_offer',
        'percentage_min_trip_partner',
        'percentage_max_trip_partner',
    ];

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
