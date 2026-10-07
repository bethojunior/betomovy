<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class BalanceFlowType extends Model
{
    protected $table = 'balanceFlowType';

    protected $primaryKey = 'idBalanceFlowType';

    public function flowType()
    {
        return $this->belongsTo(FlowType::class, 'flowId');
    }

    public function balanceFlowReference()
    {
        return $this->belongsTo(BalanceFlowReference::class, 'balanceFlowReferenceId');
    }
}
