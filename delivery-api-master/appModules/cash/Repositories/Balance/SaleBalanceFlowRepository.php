<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 16:23
 */

namespace Cash\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\SaleBalanceFlow;

class SaleBalanceFlowRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(SaleBalanceFlow::class);
    }
}
