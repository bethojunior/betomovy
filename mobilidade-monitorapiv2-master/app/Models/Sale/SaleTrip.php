<?php

namespace App\Models\Sale;

use App\Models\DiscountCoupon\DiscountCoupon;
use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DateTime;

class SaleTrip extends Model
{
    use SoftDeletes;

    protected $table = 'saleTrip';

    public $timestamps = false;

    protected $fillable = [
        'cityId',
        'label',
        'quantity',
        'startDay',
        'endDay',
        'status',
        'type',
        'limitedTo'
    ];

    public function city()
    {
        return $this->hasOne(City::class, 'id', 'cityId');
    }

    public function discountCoupon()
    {
        return $this->hasOne(DiscountCoupon::class, 'saleTripId');
    }

    public function toArray()
    {
        $toArray = parent::toArray();
        $toArray['cityId'] = $this->getRelationValue('city');

        $startDay = new DateTime($toArray['startDay']);
        $toArray['startDay'] = $startDay->format('Y-m-d');

        $endDay = new DateTime($toArray['endDay']);
        $toArray['endDay'] = $endDay->format('Y-m-d');

        return $toArray;
    }
}
