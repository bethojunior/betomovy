<?php

namespace App\Models\Company;

use App\Models\Balance\Balance;
use App\Models\Delivery\CompanyDeliveryConfig;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'company';

    protected $fillable = [
        'name',
        'fantasyName',
        'address',
        'document',
        'cityId',
        'email',
        'phone',
        'facebook',
        'instagram',
        'site',
        'billingDay',
        'voucherLimit',
        'latitude',
        'longitude',
        'logo_picture',
        'balanceId',
        'companyRegisterStatusId',
        'establishmentCollectionManagementId',
        'registration',
        'observation'
    ];

    protected $hidden = [
        'statusId'
    ];

    public function setDocumentAttribute($value)
    {
        $this->attributes['document'] = onlyCharacters($value);
    }

    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = onlyCharacters($value);
    }

    public function companyRegisterStatus()
    {
        return $this->belongsTo(CompanyRegisterStatus::class, 'companyRegisterStatusId');
    }

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId');
    }

    public function companyWorkers()
    {
        return $this->hasMany(CompanyWorker::class, 'companyId');
    }

    public function companyDeliveryConfig()
    {
        return $this->hasOne(CompanyDeliveryConfig::class, 'companyId');
    }
}
