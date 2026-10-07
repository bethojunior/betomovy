<?php

namespace app\services;

use app\constant\TransactionConst;
use app\dao\TransactionDao;
use app\exceptions\TransactionException;
use app\model\Transaction;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/12/2018
 * Time: 10:34.
 */
class TransactionService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TransactionDao();
    }

    public function returnStatusId($statusString)
    {
        switch ($statusString) {
            case TransactionConst::APPROVED:
                return TransactionConst::COMPLETED;
            default:
                return TransactionConst::REJECTED;
        }
    }

    public function insert(Transaction $transaction): Transaction
    {
        $this->dao->sqlInsert($transaction);

        return $transaction;
    }

    /**
     * @throws \Exception
     */
    public function update(Transaction $transaction): Transaction
    {
        $set = [];
        $bind = [];

        foreach ($transaction->extract() as $key => $value) {
            if ($value) {
                if ($key != 'idTransaction' && $key != 'paymentFormId') {
                    $set[$key] = ":$key";
                }

                if ($key != 'paymentFormId') {
                    $bind[":$key"] = $value;
                }
            }
        }

        $this->dao
            ->sqlUpdate($set, [['idTransaction', '=', ':idTransaction']], $bind);

        return $transaction;
    }

    /**
     * @throws TransactionException
     */
    public function find($idTransaction): Transaction
    {
        $transaction = $this->dao
            ->find($idTransaction);

        if (!$transaction) {
            throw new TransactionException(450, ['sended' => $idTransaction]);
        }

        return new Transaction($transaction);
    }

    public function getInProcessPayments()
    {
        $transactions = $this->dao->findInProcess();

        return $transactions;
    }

    public function getPeddingTransactionsPixByUserId(int $userId, int $formPayment)
    {
        return $this->dao->getPeddingTransactionsByUserId($userId, $formPayment, 1);
    }

    public function confirmPixTransaction($transaction)
    {
        return $this->dao
            ->sqlUpdate([
                'status' => ':statusString',
                'status_detailed' => ':statusDetailed',
                'transactionStatusId' => ':transactionStatusId',
            ], [['idTransaction', '=', ':idTransaction']], [
                ':idTransaction' => $transaction->getIdTransaction(),
                ':statusString' => TransactionConst::COMPLETED,
                ':statusDetailed' => 'PAGO',
                ':transactionStatusId' => TransactionConst::COMPLETED,
            ]);
    }

    public function confirmPixTransactionv2(Transaction $transaction)
    {
        return $this->dao
            ->sqlUpdate([
                'status' => ':statusString',
                'status_detailed' => ':statusDetailed',
                'transactionStatusId' => ':transactionStatusId',
            ], [['idTransaction', '=', ':idTransaction']], [
                ':idTransaction' => $transaction->getIdTransaction(),
                ':statusString' => TransactionConst::COMPLETED,
                ':statusDetailed' => 'PAGO',
                ':transactionStatusId' => TransactionConst::COMPLETED,
            ]);
    }

    public function updateStatusOnly(Transaction $transaction)
    {
        return $this->dao->updateStatusFields(
            $transaction->getIdTransaction(),
            $transaction->getTransactionStatusId(),
            $transaction->getStatus()
        );
    }
}
