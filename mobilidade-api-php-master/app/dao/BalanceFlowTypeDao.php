<?php

namespace app\dao;

use app\utils\BaseDao;

class BalanceFlowTypeDao extends BaseDao
{
    protected $table = 'balanceFlowType';

    /**
     * @return int|null
     */
    public function findIdByName(string $name)
    {
        $row = $this->sqlSelect(
            ['idBalanceFlowType'],
            [['name', '=', ':name']],
            [],
            1
        )
            ->bind([':name' => $name])
            ->get(false);

        if (!$row || !isset($row->idBalanceFlowType)) {
            return null;
        }

        return (int) $row->idBalanceFlowType;
    }
}
