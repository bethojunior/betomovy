<?php


namespace Delivery\Models\Promotion;

use Illuminate\Database\Eloquent\Model;

class UserDiscountCouponDelivery extends Model
{
    const UPDATED_AT = null;

    protected $table = "userDiscountCouponDelivery";

    protected $fillable = [
        "userId",
        "discountCouponDeliveryId"
    ];

    public function discountCouponDelivery()
    {
        return $this->belongsTo(DiscountCouponDelivery::class,"discountCouponDeliveryId");
    }
}
