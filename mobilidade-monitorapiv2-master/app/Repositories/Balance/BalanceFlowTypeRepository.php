<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 14:06
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlowType;
use Illuminate\Database\Eloquent\Builder;

class BalanceFlowTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BalanceFlowType::class);
    }

    public function findSearchable()
    {
        return $this->getModel()
            ::where('showType', true)
            ->with('flowType')
            ->with('balanceFlowReference')
            ->get();
    }

    /**
     * @return Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function listBySelect()
    {

        return $this->getModel()
            ::select(
                'idBalanceFlowType AS id',
                'flow AS text'
            )
            ->groupBy('flow')
            ->get();
    }
}
