<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class BalanceFlow extends Model
{
    const CREATED_AT = 'date';
    const UPDATED_AT = null;

    protected $table = 'balanceFlow';

    protected $primaryKey = 'idBalanceFlow';

    protected $fillable = [
        'balanceFlowTypeId', 'value', 'date', 'balanceId', 'responsibleUserId'
    ];

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId', 'idBalance');
    }
}
