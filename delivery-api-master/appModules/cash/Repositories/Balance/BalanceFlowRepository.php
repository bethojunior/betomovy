<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 15:59
 */

namespace Cash\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlow;

class BalanceFlowRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(BalanceFlow::class);
    }

    public function insert($value, $balanceType, $balanceId)
    {
        $balanceFlow = new BalanceFlow();
        $balanceFlow->date =  date('Y-m-d H:i:s');
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->save();
    }
}
