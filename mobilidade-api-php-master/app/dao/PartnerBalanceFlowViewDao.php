<?php

namespace app\dao;

use app\services\PartnerBalanceFlowService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\validator\BalanceFlowValidator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2018
 * Time: 16:37
 */
class PartnerBalanceFlowViewDao extends BaseDao
{
    const LIMIT_LAST_TRANSACTIONS = 10;

    protected $table = "partner_balance_flow_view";
    private $validator;
    private $service;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->validator = new BalanceFlowValidator;
        $this->service = new PartnerBalanceFlowService;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function financialTransactions($request)
    {
        $this->validator->validateDateIntervalDriverTransactions($request->date_interval);
        $resultWhere = $this->service->getWhereForPartnerTransactions($request);

        $count = $this->sqlSelect(['COUNT(*) AS totalRows'], $resultWhere['where'])
            ->bind($resultWhere['bind'])
            ->get(false);

        $resultSql = $this->service->getSqlForPartnerTransactions(
            $count->totalRows, $resultWhere['where'], $request->page ?? null);

        $transactions = $this->sqlRawSelect($resultSql['sql'], $resultWhere['bind'])
            ->get();

        $partnerInfoSql = $this->service->getSqlPartnerInfo($resultWhere['where'], $request->date_interval);

        $customerInfo = $this->sqlRawSelect($partnerInfoSql, $resultWhere['bind'])
            ->get(false);

        return [
            'paginate' => $resultSql['paginationInfo'],
            'transactions' => $transactions,
            'customerInfo' => $customerInfo
        ];
    }

    /**
     * @param $idCustomer
     * @return array
     * @throws Exception
     */
    public function lastTransactions($idCustomer)
    {
        $sql = /** @lang sql */ "
            SELECT
                pbfv.flow,
                pbfv.color,
                pbfv.balanceFlowTypeId,
                pbfv.value,
                pbfv.price,
                pbfv.summary,
                pbfv.tripReference,
                date_format(pbfv.date, '%d/%m/%Y - %H:%ih') AS date,
                pbfv.withdrawId,
                CASE
                    WHEN w.idWithdraw IS NULL THEN NULL
                    WHEN w.recused = 1 THEN 'refused'
                    WHEN w.paid = 1 THEN 'paid'
                    ELSE 'pending'
                END AS withdrawStatus,
                date_format(w.created_at, '%d/%m/%Y - %H:%ih') AS withdrawRequestedAt,
                date_format(w.paymentDate, '%d/%m/%Y - %H:%ih') AS withdrawPaidAt,
                date_format(w.refusalDate, '%d/%m/%Y - %H:%ih') AS withdrawRefusedAt,
                w.reason AS withdrawRefusalReason,
                w.bankAccount AS withdrawDestination
            FROM {$this->table} pbfv
                LEFT JOIN withdraw w ON w.idWithdraw = pbfv.withdrawId
            WHERE pbfv.idCustomer = :idCustomer
            ORDER BY pbfv.date DESC, pbfv.idBalanceFlow ASC
            LIMIT " . self::LIMIT_LAST_TRANSACTIONS;

        $transactions = $this->sqlRawSelect($sql, [':idCustomer' => $idCustomer])
            ->get();

        $balance = (new BalanceDao)
            ->findByPartner($idCustomer);

        return [
            'transactions' => $transactions,
            'balance' => $balance
        ];
    }
}