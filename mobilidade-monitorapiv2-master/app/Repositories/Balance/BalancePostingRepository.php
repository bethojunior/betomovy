<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/04/2020
 * Time: 11:10
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalancePosting;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BalancePostingRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(BalancePosting::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::orderByDesc('created_at')
            ->with([
                'userType',
                'balanceFlowType' => function (BelongsTo $query) {
                    $query
                        ->with('flowType');
                }
            ])
            ->get();
    }

    public function findByBillingDay(int $billingDay)
    {
        return $this->getModel()
            ::where('billingDay', $billingDay)
            ->get();
    }
}
