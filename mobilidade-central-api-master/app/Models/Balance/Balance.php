<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'balance';

    protected $fillable = [
        'tripBalance',
        'bloquedBalance',
        'balance',
        'pendingBalanceWithdraw',
        'withheldBalance',
        'blockedBalanceToPay'
    ];

    protected $primaryKey = 'idBalance';
}
