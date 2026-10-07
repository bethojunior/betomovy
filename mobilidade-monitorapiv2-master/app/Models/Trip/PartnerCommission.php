<?php

namespace App\Models\Trip;

use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Model;

class PartnerCommission extends Model
{
    protected $table = 'partnerCommission';

    protected $fillable = [
        'tripTypeId',
        'cityId',
        'partnerCommissionType',
        'partnerCommissionValue'
    ];

    protected $hidden = [
        'partnerId',
        'appCommissionType',
        'appCommissionValue',
        'managerCommissionValue',
        'managerCommissionType',
    ];

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
