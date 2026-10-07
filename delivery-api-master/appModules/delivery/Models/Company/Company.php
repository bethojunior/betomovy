<?php

namespace Delivery\Models\Company;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'company';

    public function companyDeliveryConfig()
    {
        return $this->hasOne(CompanyDeliveryConfig::class, 'companyId');
    }

    public function companyAddresses()
    {
        return $this->hasMany(CompanyAddress::class, 'companyId');
    }

    public function companyOpenHours()
    {
        return $this->hasMany(CompanyOpenHour::class, 'companyId');
    }

    public function companyPaymentForms()
    {
        return $this->hasMany(CompanyPaymentForm::class, 'companyId');
    }

    public function companyDeliveryNeighborhoods()
    {
        return $this->hasMany(CompanyDeliveryNeighborhood::class, 'companyId');
    }

    public function companyDeliveryArea()
    {
        return $this->hasMany(CompanyDeliveryArea::class, 'companyId');
    }

    public function companyDeliveryOrderConfig()
    {
        return $this->hasOne(CompanyDeliveryOrderConfig::class, 'companyId');
    }

    public function defaultAddress()
    {
        return $this->hasOne(CompanyAddress::class, 'companyId')
            ->where('isDefault', true)
            ->first();
    }

    public function getLogoPictureAttribute()
    {
        return $this->attributes['logo_picture'] = $this->attributes['logo_picture'] ?
            \Storage::cloud()
                ->url($this->attributes['logo_picture']) :
            null;
    }

    public function establishmentCategoryDelivery()
    {
        return $this->hasMany(EstablishmentCategoryDelivery::class, "companyId");
    }
}
