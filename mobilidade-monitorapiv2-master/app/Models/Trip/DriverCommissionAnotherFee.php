<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class DriverCommissionAnotherFee extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'driverCommissionAnotherFee';

    protected $fillable = [
        'taxValueType',
        'valueType',
        'tax_value',
        'another_value',
        'driverCommissionId',
    ];
}
