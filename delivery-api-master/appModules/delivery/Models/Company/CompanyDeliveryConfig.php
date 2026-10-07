<?php

namespace Delivery\Models\Company;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyDeliveryConfig extends Model
{
    use SoftDeletes;

    protected $table = 'companyDeliveryConfig';

    protected $hidden = [
        'deleted_at'
    ];

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            \Storage::cloud()
                ->url('default.jpg');
    }
}
