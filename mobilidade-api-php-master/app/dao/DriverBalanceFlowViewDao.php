<?php

namespace app\dao;

use app\services\BalanceFlowService;
use app\utils\BaseDao;
use app\utils\BalanceTransactionFormatter;
use app\validator\BalanceFlowValidator;
use app\utils\Connection;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 14:24
 */
// Read-only class
class DriverBalanceFlowViewDao extends BaseDao
{
    const LIMIT_LAST_TRANSACTION_GROUPS = 4;

    protected $table = "driver_balance_flow_view";

    private $service;
    private $validator;

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        $this->service = new BalanceFlowService;
        $this->validator = new BalanceFlowValidator;
        parent::__construct($conn, $dbtype);
    }

    /**
     * @param $driverId
     * @return array
     * @throws Exception
     */
    public function lastDriverTransactions($driverId)
    {
        $sql = $this->service->getSqlLastDriverTransactions(self::LIMIT_LAST_TRANSACTION_GROUPS);

        $transactions = $this->sqlRawSelect($sql, [':driverId' => $driverId])
            ->get();
        
        $transactions = BalanceTransactionFormatter::formatLastTransactions($transactions);
        
        $balance = (new BalanceDao)
            ->findByDriver($driverId);

        return [
            'transactions' => $transactions,
            'balance' => $balance
        ];
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function driverTransactionsFiltered($request)
    {
        $this->validator->validateDateIntervalDriverTransactions($request->date_interval);
        $resultWhere = $this->service->getWhereForDriverTransactions($request);

        $count = $this->sqlRawSelect(
            $this->service->getSqlCountDriverTransactionGroups($resultWhere['where']),
            $resultWhere['bind']
        )->get(false);

        $resultSql = $this->service->getSqlForDriverTransactions($count->totalRows, $resultWhere['where'], $request->page ?? null);

        $transactions = $this->sqlRawSelect($resultSql['sql'], $resultWhere['bind'])
            ->get();
        
        $transactions = BalanceTransactionFormatter::formatTransactions($transactions);

        $driverInfoSql = $this->service->getSqlDriverInfo($resultWhere['where'], $request->date_interval);

        $driverInfo = $this->sqlRawSelect($driverInfoSql, $resultWhere['bind'])
            ->get(false);

        $driverInfo = BalanceTransactionFormatter::formatDriverInfoPeriod($driverInfo, $request->date_interval);
        $this->removeNullValues($driverInfo);

        return [
            'paginate' => $resultSql['paginationInfo'],
            'transactions' => $transactions,
            'driverInfo' => $driverInfo
        ];
    }

    private function removeNullValues(&$driverInfo)
    {
        $driverInfo->total_credit = $driverInfo->total_credit ? floatval($driverInfo->total_credit) : 0;
        $driverInfo->total_debit = $driverInfo->total_debit ? floatval($driverInfo->total_debit) : 0;
    }
}