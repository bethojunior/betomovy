<?php

namespace App\Models\Trip;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DriverCommission extends Model
{
    protected $table = 'driverCommission';

    protected $primaryKey = 'idDriverCommission';

    protected $fillable = [
        'value',
        'valueType',
        'cityId',
        'tripTypeId',
        'disableOnPromotion',
        'statusId',
    ];

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function commissionAnotherFee(): HasOne
    {
        return $this->hasOne(DriverCommissionAnotherFee::class, 'driverCommissionId');
    }

    public function commissionsPaymentForm(): HasMany
    {
        return $this->hasMany(DriverCommissionPaymentForm::class, 'driverCommissionId');
    }
}
