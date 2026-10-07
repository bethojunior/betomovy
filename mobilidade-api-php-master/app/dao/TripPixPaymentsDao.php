<?php

namespace app\dao;

use app\constant\TransactionConst;
use app\model\TripPixPayments;
use app\utils\BaseDao;

class TripPixPaymentsDao extends BaseDao
{
    protected $table = "tripPixPayments";

    /**
     * @param TripPixPayments $tripPixPayment
     * @return TripPixPayments
     */
    public function insertTripPixPayment(TripPixPayments $tripPixPayment): TripPixPayments
    {
        $id = $this->sqlInsert($tripPixPayment);
        $tripPixPayment->setId($id);
        return $tripPixPayment;
    }

    /**
     * @param string $tripReference
     */
    public function isTripPaid(string $tripReference)
    {
        $sql = "
            SELECT EXISTS (
                SELECT 1
                FROM {$this->table} tpp
                JOIN transaction t 
                    ON t.idTransaction = tpp.idTransaction
                WHERE t.transactionStatusId = :transactionStatusId
                AND tpp.tripReference = :tripReference
            ) AS hasPaid
        ";
    
        $bind = [
            ':tripReference' => $tripReference,
            ':transactionStatusId' => TransactionConst::COMPLETED,
        ];
    

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @param string $idTransaction
     */
    public function getByIdTransaction(string $idTransaction)
    {
        $sql = "
            SELECT tpp.tripReference
            FROM {$this->table} tpp
            WHERE tpp.idTransaction = :idTransaction
            LIMIT 1
        ";
    
        $bind = [
            ':idTransaction' => $idTransaction,
        ];
        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function getTransactionByTrip(string $tripReference)
    {
        $sql = "
            SELECT 
                t.idTransaction,
                t.paymentFormId,
                t.typeId,
                t.generatedPaymentId,
                t.value
            FROM {$this->table} tpp
            JOIN transaction t
                ON t.idTransaction = tpp.idTransaction
            WHERE tpp.tripReference = :tripReference
            AND t.transactionStatusId = :transactionStatusId
            ORDER BY t.idTransaction DESC
            LIMIT 1
        ";
    
        $bind = [
            ':tripReference' => $tripReference,
            ':transactionStatusId' => TransactionConst::COMPLETED,
        ];
        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}