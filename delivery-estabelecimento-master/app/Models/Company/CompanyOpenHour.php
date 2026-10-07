<?php

namespace App\Models\Company;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyOpenHour extends Model
{
    use SoftDeletes;

    protected $table = 'companyOpenHour';
}
