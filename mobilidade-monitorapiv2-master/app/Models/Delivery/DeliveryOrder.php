<?php


namespace App\Models\Delivery;


use App\Models\Company\Company;
use App\Models\Company\CompanyAddress;
use App\Models\Trip\DriverCalled;
use App\Models\User\Driver;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    protected $table = 'deliveryOrder';

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

    public function companyAddress()
    {
        return $this->belongsTo(CompanyAddress::class, "companyAddressId");
    }

}
