<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/10/2018
 * Time: 01:15.
 */
class DriverBalanceDao extends BaseDao
{
    protected $table = 'balance';

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    public function find($idBalance, array $fields = [])
    {
        return $this->sqlSelect($fields, [['idBalance', '=', $idBalance]])
            ->bind([':idBalance' => $idBalance])
            ->get(false);
    }

    /**
     * Encontrar saldo pelo ID do usuário.
     *
     * @return array|mixed
     */
    public function findByUser(int $userId)
    {
        $sql = /* @lang SQL */ '
            SELECT
              b.idBalance,
              b.balance,
              b.pendingBalanceWithdraw,
              b.blockedBalance
            FROM balance b
              INNER JOIN driver d ON d.balanceId = b.idBalance 
            WHERE d.userId = :userId
        ';

        return $this->sqlRawSelect($sql, [
            ':userId' => $userId,
        ])
            ->first();
    }

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    public function add($idBalance, $value, string $property = 'balance')
    {
        $balance = $this->find($idBalance);

        $balance->$property += $value;

        $this->sqlUpdate(
            [$property => ":$property"],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $idBalance, ":$property" => $balance->$property]
        );

        return $balance;
    }

    /**
     * @return array|mixed
     *
     * @throws \Exception
     */
    public function sub($idBalance, $value, string $property = 'balance')
    {
        $balance = $this->find($idBalance);

        $balance->$property -= $value;

        $this->sqlUpdate(
            [$property => ":$property"],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $idBalance, ":$property" => $balance->$property]
        );

        return $balance;
    }

    /**
     * @param int|string $idBalance
     * @param float $value
     * @param int $balanceFlowTypeId
     *
     * @throws \Throwable
     */
    public function subWithZafiraValidationBalanceFlow(
        $idBalance,
        float $value,
        int $balanceFlowTypeId,
        ?string $tripReference = null
    ): void {
        $this->beginTransaction();
        try {
            $this->sub($idBalance, $value, 'balance');
            (new BalanceFlowDao())->insert(
                $value,
                $balanceFlowTypeId,
                $idBalance,
                $tripReference
            );
            $this->commit();
        } catch (\Throwable $e) {
            $this->rollback();
            throw $e;
        }
    }

    public function updateBalance(int $idBalance, array $data)
    {
        return $this
            ->sqlUpdate([
                'balance' => ':amount',
            ], [['idBalance', '=', ':idBalance']], [
                ':idBalance' => $idBalance,
                ':amount' => (float) number_format($data['amount'], 2, '.', ''),
            ]);
    }
}
