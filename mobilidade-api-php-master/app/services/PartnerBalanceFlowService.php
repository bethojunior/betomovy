<?php

namespace app\services;

use app\utils\Pagination;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/10/2018
 * Time: 16:57
 */
class PartnerBalanceFlowService
{
    private $table = "partner_balance_flow_view";

    /**
     * @param $request
     * @return array
     */
    public function getWhereForPartnerTransactions($request)
    {
        $where = [
            ['date_format(' . $this->table . '.date, \'%Y-%m-%d\')', 'BETWEEN', ':date_start AND :date_end', 'AND'],
            ['idCustomer', '=', ':customerId'],
        ];

        $bind = [
            ':customerId' => $request->customerId,
            ':date_start' => $request->date_interval->date_start,
            ':date_end' => $request->date_interval->date_end,
        ];

        if (isset($request->flow)) {
            $where[count($where) - 1][] = 'AND';
            $where[] = ['flow', '=', ':flow'];
            $bind[':flow'] = $request->flow;
        }

        return ['where' => $where, 'bind' => $bind];
    }

    public function getSqlForPartnerTransactions($totalRows, $where, $page)
    {
        $pagination = new Pagination($totalRows, $page);

        $whereString = $this->getWhereLikeString($where);

        $sql = "
            SELECT
                flow,
                color,
                balanceFlowTypeId,
                value,
                price,
                summary,
                tripReference,
                date_format(date, '%d/%m/%Y - %H:%ih') AS dateFormatted,
                date
            FROM {$this->table}
            WHERE {$whereString} 
              ORDER BY 
                {$this->table}.date DESC,
                {$this->table}.idBalanceFlow ASC
            LIMIT {$pagination->getLimit()};
        ";

        return ['sql' => $sql, 'paginationInfo' => $pagination->getPaginationInfo()];
    }

    /**
     * @param $where
     * @return string
     */
    private function getWhereLikeString($where)
    {
        return implode(" ", array_map(function ($uniqueWhere) {
            return implode(" ", $uniqueWhere);
        }, $where));
    }

    public function getSqlPartnerInfo($where, $date_interval)
    {
        $customerWhereString = $this->getWhereLikeString([$where[1]]);
        $whereString = str_replace(
            ['idCustomer', ':customerId'],
            ['c.idCustomer', "{$this->table}.idCustomer"],
            $this->getWhereLikeString($where));

        $sql = "
            SELECT
              c.idCustomer,
              u.name,
              ba.holderName,
              ba.document,
              CONCAT(
                DATE_FORMAT('{$date_interval->date_start}', '%d/%m/%Y'),
                ' até ',
                DATE_FORMAT('{$date_interval->date_end}', '%d/%m/%Y')
              ) AS period,
              b.balance,
              b.tripBalance,
              FORMAT(IFNULL(SUM(
                CASE 
                  WHEN {$this->table}.flow = 'entrada' && {$this->table}.balanceFlowTypeId NOT IN (23) THEN 
                    {$this->table}.value 
                  ELSE 0 
                END), 0), 2) AS total_credit,
              FORMAT(IFNULL(SUM(
                CASE 
                  WHEN {$this->table}.flow = 'saida' THEN 
                    {$this->table}.value 
                  ELSE 0 
                END), 0), 2) AS total_debit,
              GROUP_CONCAT({$this->table}.idBalanceFlow) AS IDS,
              b.pendingBalanceWithdraw,
              b.blockedBalance,
              b.blockedBalanceToPay
            FROM customer c
              INNER JOIN user u on c.userId = u.idUser
              INNER JOIN balance b on c.balanceId = b.idBalance 
              LEFT JOIN {$this->table} on ({$whereString})
              LEFT JOIN bankAccount ba ON ba.idBankAccount = u.bankAccountId
              WHERE c.{$customerWhereString}
        ";

        return $sql;
    }
}