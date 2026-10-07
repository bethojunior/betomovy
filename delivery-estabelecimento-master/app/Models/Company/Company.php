<?php

namespace App\Models\Company;

use App\Models\Balance\Balance;
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
    ];

    protected $hidden = [
        'statusId'
    ];

    public function setDocumentAttribute($value)
    {
        $this->attributes['document'] = $value ?
            str_replace('/', '', onlyNumberAndLetters($value)) :
            null;
    }

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId');
    }

    public function companyDeliveryConfig()
    {
        return $this->hasOne(CompanyDeliveryConfig::class, 'companyId');
    }
}
