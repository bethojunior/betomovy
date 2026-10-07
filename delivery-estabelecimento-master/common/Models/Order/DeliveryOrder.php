<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 10:57
 */

namespace Common\Models\Order;


use App\Models\Company\Company;
use App\Models\Company\DeliveryPaymentForm;
use App\Models\User;
use Common\Models\Driver\Driver;
use Common\Models\Promotion\UserDiscountCouponDelivery;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    protected $table = 'deliveryOrder';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function deliveryOrderStatus()
    {
        return $this->belongsTo(DeliveryOrderStatus::class, 'deliveryOrderStatusId');
    }

    public function deliveryPaymentForm()
    {
        return $this->belongsTo(DeliveryPaymentForm::class, 'deliveryPaymentFormId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    public function deliveryOrderItems()
    {
        return $this->hasMany(DeliveryOrderItem::class, 'deliveryOrderId');
    }

    public function deliveryOrderPlace()
    {
        return $this->hasOne(DeliveryOrderPlace::class, 'deliveryOrderId');
    }

    public function userDiscountCouponDelivery()
    {
        return $this->belongsTo(UserDiscountCouponDelivery::class, 'id', "deliveryOrderId");
    }

    public function company()
    {
        return $this->belongsTo(Company::class, "companyId","id");
    }

    public function orderDeliveryType()
    {
        return $this->belongsTo(OrderDeliveryType::class, "orderDeliveryTypeId","id");
    }
}
