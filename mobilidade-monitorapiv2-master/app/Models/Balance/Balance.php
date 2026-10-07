<?php

namespace App\Models\Balance;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    protected $table = 'balance';

    protected $primaryKey = 'idBalance';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = [
        'tripBalance',
        'bloquedBalance',
        'balance',
        'pendingBalanceWithdraw',
        'withheldBalance',
        'blockedBalanceToPay'
    ];

    public function driver()
    {
        return $this->hasOne(Driver::class, 'balanceId', 'idBalance');
    }
}
