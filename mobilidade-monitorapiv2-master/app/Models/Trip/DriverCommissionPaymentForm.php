<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class DriverCommissionPaymentForm extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'driverCommissionPaymentForm';

    protected $fillable = [
        'value',
        'valueType',
        'driverCommissionId',
        'tripPaymentFormId',
    ];
}
