<?php

namespace App\Models\Delivery;

use App\Models\Company\Company;
use Illuminate\Database\Eloquent\Model;

class CompanyOpenHour extends Model
{
    protected $table = 'companyOpenHour';

    public function company()
    {
        return $this->belongsTo(Company::class, 'companyId');
    }
}
