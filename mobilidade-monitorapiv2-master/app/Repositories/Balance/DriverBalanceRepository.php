<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/09/2019
 * Time: 17:09
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Balance;
use Illuminate\Database\Eloquent\Builder;

class DriverBalanceRepository extends AbstractRepository
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

    public function findByUserType($userTypeId)
    {
        return $this->getModel()
            ::whereHas('driver', function (Builder $query) use ($userTypeId){
                $query
                    ->whereHas('user', function (Builder $query) use ($userTypeId){
                        $query
                            ->whereHas('userType', function (Builder $query) use ($userTypeId){
                                $query
                                    ->where('idUserType', $userTypeId);
                            });
                    });
            })
            ->get();
    }

    public function findAll()
    {
        return $this->getModel()
            ::whereHas('driver')
            ->get();
    }

    public function findByUserId(int $userId)
    {
        return $this->getModel()
            ::whereHas('driver', function (Builder $query) use ($userId) {
                $query
                    ->where('userId', $userId);
            })
            ->first();
    }

    public function updateManyBalances(array $values)
    {
        $table = $this->getModel()
            ::getModel()
            ->getTable();

        $ids = [];
        $params = [];

        foreach ($values as $id => $value) {
            $id = (int) $id;
            $params[] = $value;
            $ids[] = $id;
        }

        $ids = implode(',', $ids);
//        $params[] = Carbon::now();

        return \DB::update("
            UPDATE `{$table}` SET `balance` = `balance` + ? WHERE `idBalance` in ({$ids})",
            $params);
    }
}
