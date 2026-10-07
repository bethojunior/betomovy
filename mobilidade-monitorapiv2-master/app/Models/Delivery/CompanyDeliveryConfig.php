<?php

namespace App\Models\Delivery;

use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyDeliveryConfig extends Model
{
    use SoftDeletes;

    protected $table = 'companyDeliveryConfig';

    protected $fillable = [
        'companyId',
        'releaseMenu',
        'releaseDelivery',
        'monthlyValue',
        'chargeFixedValue',
        'chargePercentageValue',
    ];

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            \Storage::cloud()
                ->url('default.jpg');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }
}
