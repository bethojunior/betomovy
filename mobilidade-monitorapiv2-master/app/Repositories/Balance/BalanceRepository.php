<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:05
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Balance;
use App\Models\Trip\Trip;

class BalanceRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Balance::class);
    }

    public function add($idBalance, $value, $property = "balance")
    {
        $balance = $this->find($idBalance);

        $balance->$property += $value;

        $balance->save();

        return $balance;
    }


    public function updateValue($idBalance, $value, array $properties = ["balance"], array $operators = ["+"])
    {
        $set = [];
        foreach ($properties as $index => $property) {
            $set += [
                $property => "ROUND({$property} {$operators[$index]} {$value}, 2)"
            ];
        }

        $this->getModel()
            ::where("idBalance", $idBalance)
            ->update($set);
    }

    public function sub($idBalance, $value, $property = "balance")
    {
        $balance = $this->find($idBalance);

        $balance->$property -= $value;

        $balance->save();

        return $balance;
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

    public function updateTripBalance($value, $idBalance, $insertOrRemove, $balanceValue)
    {
        $finalValue = $insertOrRemove ? $balanceValue + $value : $balanceValue - $value;

        return $this->getModel()
            ::where('idBalance', $idBalance)
            ->update(['tripBalance' => $finalValue]);
    }
}
