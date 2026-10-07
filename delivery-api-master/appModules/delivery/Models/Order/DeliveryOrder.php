<?php

namespace Delivery\Models\Order;

use App\Models\Driver\Driver;
use App\Models\Driver\DriverCalled;
use App\Models\User;
use Delivery\Models\Company\Company;
use Delivery\Models\Company\CompanyAddress;
use Delivery\Models\Company\CompanyPaymentForm;
use Delivery\Models\PaymentForm\DeliveryPaymentForm;
use Delivery\Models\Promotion\UserDiscountCouponDelivery;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    protected $table = 'deliveryOrder';

    protected $fillable = [
        'companyId',
        'userId',
        'value',
        'deliveryFee',
        'changeValue',
        'deliveryPaymentFormId',
        'deliveryRateId',
        'payMachineReturnId',
        'orderDeliveryTypeId',
        'startDeliveryTime',
        'endDeliveryTime',
        'verificationCode'
    ];

    protected $dates = [
        'finished_at'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }

    public function deliveryOrderStatus()
    {
        return $this->belongsTo(DeliveryOrderStatus::class, 'deliveryOrderStatusId');
    }

    public function deliveryPaymentForm()
    {
        return $this->belongsTo(DeliveryPaymentForm::class, 'deliveryPaymentFormId');
    }

    public function deliveryOrderItems()
    {
        return $this->hasMany(DeliveryOrderItem::class, 'deliveryOrderId');
    }

    public function deliveryOrderPlace()
    {
        return $this->hasOne(DeliveryOrderPlace::class, 'deliveryOrderId');
    }

    public function driverCalled()
    {
        return $this->hasMany(DriverCalled::class, 'deliveryOrderId');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function userDiscountCouponDelivery()
    {
        return $this->belongsTo(UserDiscountCouponDelivery::class, 'id', "deliveryOrderId");
    }

    public function deliveryRating()
    {
        return $this->belongsTo(DeliveryRating::class, "id", "deliveryOrderId");
    }

    public function companyAddress()
    {
        return $this->belongsTo(CompanyAddress::class, "companyAddressId");
    }
}
