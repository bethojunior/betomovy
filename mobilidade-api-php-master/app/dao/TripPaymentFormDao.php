<?php

namespace app\dao;

use app\constant\PaymentFormTypeConst;
use app\utils\BaseDao;
use app\model\Status;
use app\utils\Headers;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/10/2018
 * Time: 17:32
 */
class TripPaymentFormDao extends BaseDao
{
    protected $table = 'tripPaymentForm';

    public function getAll(?stdClass $request = null)
    {
        $where = 'tpf.statusId = :statusId';
        $bind = [':statusId' => Status::ATIVO];

        if (isset($request->paymentInVehicle)) {
            $where .= ' AND tpf.paymentFormTypeId IN (2, 4)';
        }

        $driver = (new DriverDao())->findByUserId(Headers::getUserId(), false);
        if (empty($driver)) {
            $where .= ' AND tpf.paymentFormTypeId <> :voucherCentral';
            $bind[':voucherCentral'] = PaymentFormTypeConst::VOUCHER_CENTRAL;
        }

        $sql = "
            SELECT
                tpf.idTripPaymentForm,
                tpf.name,
                tpf.paymentFormTypeId,
                tpf.active,
                tpf.statusId,
                pft.description
            FROM tripPaymentForm tpf
            LEFT JOIN paymentFormType pft ON pft.id = tpf.paymentFormTypeId
            WHERE {$where}
        ";

        return $this->sqlRawSelect($sql, $bind)->get();
    }

    public function find($tripPaymentFormId, $fields = [])
    {
        return $this->sqlSelect($fields, [['idTripPaymentForm', '=', ':idTripPaymentForm']])
            ->bind([':idTripPaymentForm' => $tripPaymentFormId])
            ->get(false);
    }

    public function findMultiple()
    {
        return $this->sqlSelect([], [
            ['paymentFormTypeId', '=', ':paymentFormTypeId']
        ], [], 1)
            ->bind([':paymentFormTypeId' => PaymentFormTypeConst::MULTIPLE])
            ->first();
    }

    public function findByType(int $paymentFormTypeId)
    {
        return $this->sqlSelect([], [
            ['paymentFormTypeId', '=', ':paymentFormTypeId']
        ], [], 1)
            ->bind([':paymentFormTypeId' => $paymentFormTypeId])
            ->first();
    }
}