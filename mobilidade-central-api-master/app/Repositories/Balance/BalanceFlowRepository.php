<?php

namespace App\Repositories\Balance;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Balance;
use App\Models\Balance\BalanceFlow;
use Carbon\Carbon;

class BalanceFlowRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(BalanceFlow::class);
    }

    public function insert($value, $balanceType, $balanceId, $tripReference = null)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->date = Carbon::now();
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->tripReference = $tripReference;

        $balanceFlow->save();

        return $balanceFlow;
    }
}
