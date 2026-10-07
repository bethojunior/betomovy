<?php

namespace App\Models\DiscountCoupon;

use App\Models\Enum\Gender;
use App\Models\Locale\City;
use App\Models\Trip\TripPaymentForm;
use Illuminate\Database\Eloquent\Model;

class DiscountCoupon extends Model
{
    protected $table = 'discountCoupon';

    protected $fillable = [
        'code',
        'tripPaymentFormId',
        'genderId',
        'value',
        'valueType',
        'limitedTo',
        'fromValue',
        'bonusDriver',
        'uniqueUse',
        'active',
        'dateStart',
        'dateEnd',
        'cityId',
        'maxDiscountValue',
        'saleTripId',
        'statusId'
    ];

    protected $hidden = [
        'statusId'
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'genderId');
    }

    public function tripPaymentForm()
    {
        return $this->belongsTo(TripPaymentForm::class, 'tripPaymentFormId');
    }
}
