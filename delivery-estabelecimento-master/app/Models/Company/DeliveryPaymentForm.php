<?php

namespace App\Models\Company;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryPaymentForm extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryPaymentForm';

    public function companyPaymentForms()
    {
        return $this->hasMany(CompanyPaymentForm::class, 'deliveryPaymentFormId');
    }
}
