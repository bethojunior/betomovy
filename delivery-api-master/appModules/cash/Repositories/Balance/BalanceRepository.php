<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/03/2020
 * Time: 11:15
 */

namespace Cash\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Balance;
use Illuminate\Database\Eloquent\Builder;

class BalanceRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Balance::class);
    }

    public function findByUser(int $userId)
    {
        return $this->getModel()
            ::whereHas('customerView', function (Builder $query) use ($userId) {
                $query
                    ->where('idUser', $userId);
            })
            ->with('customerView')
            ->firstOrFail();
    }

    public function addBalance($balanceId, $value)
    {
        $balance = Balance::find($balanceId);
        $balance->balance += $value;
        $balance->save();

        return $balance;
    }


    public function subBalance($balanceId, $value)
    {
        $balance = Balance::find($balanceId);
        $balance->balance -= $value;
        $balance->save();

        return $balance;
    }
}
