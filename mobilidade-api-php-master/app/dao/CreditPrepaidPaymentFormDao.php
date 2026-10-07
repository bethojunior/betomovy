<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 09:35
 */
class CreditPrepaidPaymentFormDao extends BaseDao
{
    protected $table = 'creditPrepaidPaymentForm';

    public function findByCreditPrepaid($creditPrepaidId)
    {
        $sql = "
            SELECT
                cppf.id,
                cppf.paymentFormId,
                cppf.creditPrepaidId,
                pf.name,
                pf.automaticPayment,
                cppf.created_at,
                cppf.updated_at
            FROM {$this->table} cppf
                INNER JOIN paymentForm pf ON cppf.paymentFormId = pf.idPaymentForm
                WHERE 
                    cppf.deleted_at IS NULL AND
                    cppf.creditPrepaidId = :creditPrepaidId
        ";

        $bind = [':creditPrepaidId' => $creditPrepaidId];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}