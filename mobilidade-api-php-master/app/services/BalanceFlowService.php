<?php

namespace app\services;

use app\dao\BalanceFlowDao;
use app\utils\Pagination;
use app\model\Balance;
use app\model\BalanceFlow;
use app\model\BankAccount;
use app\model\Driver;
use app\model\DriverBalanceFlowView;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/09/2018
 * Time: 12:00
 */
class BalanceFlowService
{
    /**
     * @param $request
     * @return array
     */
    public function getWhereForDriverTransactions($request)
    {
        $flowTable = (new DriverBalanceFlowView)->getTableName();

        $where = [
            [$flowTable . '.driverId', '=', ':driverId', 'AND'],
            [$flowTable . '.date', 'BETWEEN', ':date_start AND :date_end']
        ];

        $bind = [
            ':driverId' => $request->driverId,
            ':date_start' => $request->date_interval->date_start,
            ':date_end' => $request->date_interval->date_end,
        ];

        if (isset($request->flow)) {
            $where[count($where) - 1][] = 'AND';
            $where[] = [$flowTable . '.flow', '=', ':flow'];
            $bind[':flow'] = $request->flow;
        }

        return ['where' => $where, 'bind' => $bind];
    }

    /**
     * @param string $table
     * @return string
     */
    public function getTransactionGroupKeySql(string $table): string
    {
        return "COALESCE({$table}.tripReference, CONCAT('bf-', {$table}.idBalanceFlow))";
    }

    /**
     * @param array $where
     * @return string
     */
    public function getSqlCountDriverTransactionGroups(array $where): string
    {
        $flowTable = (new DriverBalanceFlowView)->getTableName();
        $whereString = $this->getWhereLikeString($where);

        return "
            SELECT COUNT(DISTINCT {$this->getTransactionGroupKeySql($flowTable)}) AS totalRows
            FROM {$flowTable}
            WHERE {$whereString}
        ";
    }

    /**
     * @param int $totalGroups
     * @param array $where
     * @param int|null $page
     * @return array
     */
    public function getSqlForDriverTransactions($totalGroups, $where, $page)
    {
        $pagination = new Pagination($totalGroups, $page);

        $sql = $this->buildGroupedDriverTransactionsSql(
            $this->getWhereLikeString($where),
            $pagination->getLimit()
        );

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    /**
     * @param int $limit
     * @return string
     */
    public function getSqlLastDriverTransactions(int $limit): string
    {
        $flowTable = (new DriverBalanceFlowView)->getTableName();

        return $this->buildGroupedDriverTransactionsSql(
            "{$flowTable}.driverId = :driverId",
            (string) $limit,
            ", CASE WHEN {$flowTable}.balanceFlowTypeId = 87 THEN w.reason ELSE NULL END AS reason",
            "LEFT JOIN withdraw w ON {$flowTable}.withdrawId = w.idWithdraw"
        );
    }

    /**
     * @param string $whereString
     * @param string $limit
     * @param string $extraColumns
     * @param string $extraJoins
     * @return string
     */
    private function buildGroupedDriverTransactionsSql(
        string $whereString,
        string $limit,
        string $extraColumns = '',
        string $extraJoins = ''
    ): string {
        $flowTable = (new DriverBalanceFlowView)->getTableName();
        $groupKey = $this->getTransactionGroupKeySql($flowTable);

        return "
            SELECT
                {$flowTable}.flow,
                {$flowTable}.color,
                {$flowTable}.balanceFlowTypeId,
                {$flowTable}.value,
                {$flowTable}.price,
                {$flowTable}.summary,
                {$flowTable}.tripReference,
                {$flowTable}.date,
                bf.observation,
                tpf.name AS paymentFormName{$extraColumns}
            FROM {$flowTable}
            INNER JOIN (
                SELECT
                    {$groupKey} AS groupKey,
                    MAX({$flowTable}.date) AS groupDate,
                    MIN({$flowTable}.idBalanceFlow) AS groupFirstId
                FROM {$flowTable}
                WHERE {$whereString}
                GROUP BY groupKey
                ORDER BY groupDate DESC, groupFirstId ASC
                LIMIT {$limit}
            ) pageGroups ON pageGroups.groupKey = {$groupKey}
            LEFT JOIN balanceFlow bf ON bf.idBalanceFlow = {$flowTable}.idBalanceFlow
            LEFT JOIN trip t ON t.tripReference = {$flowTable}.tripReference
            LEFT JOIN tripPaymentForm tpf ON tpf.idTripPaymentForm = t.tripPaymentFormId
            {$extraJoins}
            WHERE {$whereString}
            ORDER BY
                pageGroups.groupDate DESC,
                pageGroups.groupFirstId ASC,
                {$flowTable}.date DESC,
                {$flowTable}.idBalanceFlow ASC
        ";
    }

    public function getSqlDriverInfo($where, $date_interval)
    {
        $whereString = $this->getWhereLikeString($where);

        $flowTable = (new DriverBalanceFlowView)->getTableName();
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $balanceTable = (new Balance)->getTableName();
        $bankAccountTable = (new BankAccount)->getTableName();

        $sql = "
            SELECT
              u.name,
              ba.holderName,
              ba.document,
              b.balance,
              ROUND(SUM(CASE WHEN {$flowTable}.flow = 'entrada' THEN {$flowTable}.value ELSE 0 END), 2) AS total_credit,
              ROUND(SUM(CASE WHEN {$flowTable}.flow = 'saida' THEN {$flowTable}.value ELSE 0 END), 2) AS total_debit,
              b.pendingBalanceWithdraw,
              b.blockedBalance,
              b.blockedBalanceToPay
            FROM {$flowTable}
              INNER JOIN {$driverTable} ON {$flowTable}.driverId = {$driverTable}.idDriver
              INNER JOIN {$userTable} u on {$driverTable}.userId = u.idUser
              INNER JOIN {$balanceTable} b on {$driverTable}.balanceId = b.idBalance
              LEFT JOIN {$bankAccountTable} ba ON ba.idBankAccount = u.bankAccountId
              WHERE {$whereString}
        ";

        return $sql;
    }

    private function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    public function insertBalanceFlowPromotion($type, $amount, $balanceId): BalanceFlow
    {
        $balanceFlow = (new BalanceFlowDao)->insert($amount, $type, $balanceId);

        return $balanceFlow;
    }
}