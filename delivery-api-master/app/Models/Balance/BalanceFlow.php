<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class BalanceFlow extends Model
{
    const CREATED_AT = 'date';
    const UPDATED_AT = null;

    protected $table = 'balanceFlow';

    protected $fillable = [
        'balanceFlowTypeId',
        'value',
        'date',
        'balanceId'
    ];

    protected $primaryKey = 'idBalanceFlow';
}
