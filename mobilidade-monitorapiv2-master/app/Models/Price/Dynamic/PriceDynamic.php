<?php

namespace App\Models\Price\Dynamic;

use App\Models\Enum\WeekDay;
use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class PriceDynamic extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'priceDynamic';

    protected $primaryKey = 'idPriceDynamic';

    protected $fillable = [
        'dayOfWeek',
        'cityId',
        'multiplierValue',
        'tripTypeId',
        'timeStart',
        'timeEnd',
        'active'
    ];

    protected $hidden = ['activatedManual', 'statusId'];

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }

    public function weekDay()
    {
        return $this->belongsTo(WeekDay::class, 'dayOfWeek', 'day');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }
}
