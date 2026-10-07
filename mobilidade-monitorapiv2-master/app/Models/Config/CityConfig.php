<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class CityConfig extends Model
{
    protected $table = 'cityConfig';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $primaryKey = 'idCityConfig';

    protected $fillable = [
        'kmRemainingToPutDriverPreAvailable',
        'quantityTripWayPoints',
        'cancellationCustomerFeeValue',
        'waitingTimeCustomerCancellationFee',
        'routePercentageCancellationFee',
        'daysToBillCancellationFee',
        'securityContactNumber',
        'supportContactNumber',
        'supportEmail',
        'urlFacebook',
        'urlInstagram',
        'enabledDriverFields',
    ];

    public static function getConf($cityId)
    {
        return $configCity = self
            ::where('cityId', $cityId)
            ->first();

        return $configCity->getAttributeValue('value');
    }

    public function cityArea()
    {
        return $this->belongsTo(CityArea::class, 'cityId', 'cityId');
    }

    public function setEnabledDriverFieldsAttribute($value)
    {
        $this->attributes['enabledDriverFields'] = json_encode($value);
    }
}
