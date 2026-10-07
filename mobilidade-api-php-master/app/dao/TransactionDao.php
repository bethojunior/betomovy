<?php

namespace app\dao;

use app\constant\CheckoutStatusConst;
use app\constant\TransactionConst;
use app\utils\BaseDao;

class TransactionDao extends BaseDao
{
    /**
     * @return array|mixed
     */
    public function find($idTransaction)
    {
        $transaction = $this->sqlSelect([],
            [['idTransaction', '=', ':idTransaction']]
        )
            ->bind([':idTransaction' => $idTransaction])
            ->get(false);

        return $transaction;
    }

    public function findInProcess()
    {
        $sql = "
            SELECT
              t.*,
              v.idVoucherPurchase,
              tc.idTripCardPayment
            FROM {$this->table} t
              LEFT JOIN voucherPurchase v on t.idTransaction = v.transactionId
              LEFT JOIN tripCardPayment tc on t.idTransaction = tc.transactionId
            WHERE t.status = :status
        ";

        $bind = [
            ':status' => CheckoutStatusConst::IN_PROCESS,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getPeddingTransactionsByUserId(int $userId, int $formPayment, $maxHoursCreated = 24)
    {
        $sql = "
            SELECT
            *
            FROM {$this->table}
            WHERE transactionStatusId = :status
                AND userId = :userId
                AND paymentFormId = :paymentFormId
                AND created_at >= CONVERT_TZ(NOW(), 'UTC', 'America/Sao_Paulo') - INTERVAL :hours HOUR;
        ";

        $bind = [
            ':status' => TransactionConst::PENDENTE,
            ':userId' => $userId,
            ':hours' => $maxHoursCreated,
            ':paymentFormId' => $formPayment,
        ];

        return $this->sqlRawSelect($sql, $bind)->get();
    }

    public function findByField(string $field, $value)
    {
        $transaction = $this->sqlSelect(
            [],
            [[$field, '=', ':value']]
        )
            ->bind([':value' => $value])
            ->get(false);

        return $transaction;
    }

    public function updateStatus($idTransaction, $status)
    {
        return $this->sqlUpdate(
            [
                'updated_at' => ':updated_at',
                'transactionStatusId' => ':transactionStatusId'
            ],
            [['idTransaction', '=', ':idTransaction']],
            [
                ':updated_at' => now(),
                ':transactionStatusId' => $status,
                ':idTransaction' => $idTransaction,
            ]);
    }

    public function updateStatusFields($idTransaction, $transactionStatusId, $status)
    {
        return $this->sqlUpdate(
            [
                'updated_at' => ':updated_at',
                'transactionStatusId' => ':transactionStatusId',
                'status' => ':status',
            ],
            [['idTransaction', '=', ':idTransaction']],
            [
                ':updated_at' => now(),
                ':transactionStatusId' => $transactionStatusId,
                ':status' => $status,
                ':idTransaction' => $idTransaction,
            ]);
    }
}
