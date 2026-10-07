<?php

namespace App\Repositories\Balance;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Balance;

class BalanceRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Balance::class);
    }


    public function setWithheldBalance($balanceId,  $currentBalance,  $withheldBalance)
    {
         return $this->getModel()
            ::where('idBalance', $balanceId)
            ->update([
                'tripBalance' => $currentBalance,
                'withheldBalance' => $withheldBalance,
            ]);
    }

    public function findById($id) {
        return $this->getModel()
            ::where('idBalance', $id)
            ->first();
    }

    public function updateBalance($idBalance, $column, $value) {
        return $this->getModel()
            ::where('idBalance', $idBalance)
            ->update([$column => $value]);
    }

    public function createBalance(){
       return $this->getModel()
           ::create([
               'tripBalance' => 0,
               'blockedBalance' => 0,
               'balance' => 0,
               'pendingBalanceWithdraw' => 0,
               'withheldBalance' => 0,
               'blockedBalanceToPay' => 0,
           ]);
    }
}
