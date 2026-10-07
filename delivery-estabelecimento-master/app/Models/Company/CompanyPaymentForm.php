<?php

namespace App\Models\Company;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyPaymentForm extends Model
{
    use SoftDeletes;

    protected $table = 'companyPaymentForm';

    protected $fillable = [
        'deliveryPaymentFormId'
    ];
}
