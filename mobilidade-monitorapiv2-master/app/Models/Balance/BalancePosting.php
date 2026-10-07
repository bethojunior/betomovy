<?php

namespace App\Models\Balance;

use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BalancePosting extends Model
{
    use SoftDeletes;

    protected $table = 'balancePosting';

    protected $fillable = [
        'value',
        'balanceFlowTypeId',
        'userTypeId',
        'billingDay',
    ];

    protected $hidden = ['active', 'deleted_at'];

    public function userType()
    {
        return $this->belongsTo(UserType::class, 'userTypeId');
    }

    public function balanceFlowType()
    {
        return $this->belongsTo(BalanceFlowType::class, 'balanceFlowTypeId');
    }
}
