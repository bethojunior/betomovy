<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/04/2020
 * Time: 15:35
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlowPosted;

class BalanceFlowPostedRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(BalanceFlowPosted::class);
    }

    public function findByBalancePostingToday(int $balancePostingId)
    {
        return $this->getModel()
            ::where('balancePostingId', $balancePostingId)
            ->whereBetween(
                'created_at', [
                    now()->startOfDay(),
                    now()->endOfDay()
                ])
            ->get();
    }
}
