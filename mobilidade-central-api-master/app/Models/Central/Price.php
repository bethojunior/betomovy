<?php

namespace App\Models\Central;

use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $table = 'price';

    protected $fillable = [
        'min_price',
        'base_price',
        'km_price',
        'minute_price',
        'centralId',
        'tripTypeId',
        'tax_price',
        'another_fee',
        'waypoint_price',
        'name',
        'tag',
        'color',
    ];

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }
}
