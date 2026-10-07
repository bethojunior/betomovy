<?php

namespace app\dao;

use app\constant\DriverBalanceConst;
use app\utils\BaseDao;
use app\model\BalanceFlow;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 14/08/2018
 * Time: 11:03
 */
class BalanceFlowDao extends BaseDao
{
    protected $table = "balanceFlow";

    /**
     * @param $idBalanceFlow
     * @return mixed
     */
    public function find($idBalanceFlow)
    {
        return $this->sqlSelect([], [
            ['idBalanceFlow', '=', ':idBalanceFlow']
        ], [], 1)
            ->bind([':idBalanceFlow' => $idBalanceFlow])
            ->get(false);
    }

    /**
     * @param $idBalanceFlow
     * @param $balanceFlowTypeId
     * @return bool
     * @throws Exception
     */
    public function updateType($idBalanceFlow, $balanceFlowTypeId)
    {
        return $this->sqlUpdate([
            'balanceFlowTypeId' => ':balanceFlowTypeId'
        ], [
            ['idBalanceFlow', '=', ':idBalanceFlow']
        ], [
            ':balanceFlowTypeId' => $balanceFlowTypeId,
            ':idBalanceFlow' => $idBalanceFlow,
        ]);
    }

    public function getFlowsToGiveBack($balanceId)
    {
        $sql = "
            SELECT
                *
            FROM balanceFlow bf
                INNER JOIN driver d ON d.balanceId = bf.balanceId
                INNER JOIN userIndication ui ON ui.userIndicatedId = d.userId
                WHERE
                      ui.refund_to_fees_up_to IS NOT NULL AND
                      bf.date BETWEEN ui.created_at AND ui.refund_to_fees_up_to AND
                      bf.balanceId = :balanceId AND
                      bf.balanceFlowTypeId = :balance_out_commissions AND
                      bf.idBalanceFlow NOT IN (
                        SELECT
                            fd.balanceFlowId
                        FROM feeDevolution fd
                      );
        ";

        $bind = [
            ':balanceId' => $balanceId,
            ':balance_out_commissions' => DriverBalanceConst::BALANCE_OUT_COMMISSIONS,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $value
     * @param $balanceType
     * @param $balanceId
     * @param $tripReference
     * @param int|null $taxId
     * @return \app\model\BalanceFlow
     */
    public function insert($value, $balanceType, $balanceId, $tripReference = null, ?int $taxId = null)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setTripReference($tripReference);
        $balanceFlow->setTaxId($taxId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    public function insertWithRewardTrip($value, $balanceType, $balanceId, $rewardTripId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setRewardTripId($rewardTripId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    public function insertWithRewardCampaignTrip($value, $balanceType, $balanceId, $rewardCampaignTripId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setRewardCampaignTripId($rewardCampaignTripId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    public function insertWithWithdraw($value, $balanceType, $balanceId, $withdrawId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setWithdrawId($withdrawId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    public function insertWithCancellationFee($value, $balanceType, $balanceId, $customerCancellationFeeId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setCustomerCancellationFeeId($customerCancellationFeeId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    /**
     * @param $value
     * @param $balanceType
     * @param $balanceId
     * @param $transactionId
     * @return \app\model\BalanceFlow
     */
    public function insertWithTransaction($value, $balanceType, $balanceId, $transactionId): BalanceFlow
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->setDate(now());
        $balanceFlow->setValue($value);
        $balanceFlow->setBalanceFlowTypeId($balanceType);
        $balanceFlow->setBalanceId($balanceId);
        $balanceFlow->setTransactionId($transactionId);

        $balanceFlow->setIdBalanceFlow(
            $this->sqlInsert($balanceFlow)
        );

        return $balanceFlow;
    }

    /**
     * @param int $balanceFlowTypeId
     * @param string $tripReference
     */
    public function deleteByTripReferenceAndBalanceFlowType(string $tripReference, int $balanceFlowTypeId)
    {
        $where = [
            ["tripReference = '{$tripReference}'", 'AND'],
            ["balanceFlowTypeId = {$balanceFlowTypeId}", '', '']
        ];
        
        return $this->sqlDelete($where);
    }

    public function findByTripReferenceAndBalanceFlowType(string $tripReference, int $balanceFlowTypeId)
    {
        $where = [
            ["tripReference = '{$tripReference}'", 'AND'],
            ["balanceFlowTypeId = {$balanceFlowTypeId}", '', '']
        ];

        return $this->sqlSelect([], $where, [], 1)
            ->get(false);
    }

    /**
     * @param int $balanceId
     * @param int $balanceFlowTypeId
     * @param int $minutesInterval
     *
     * @return mixed|null
     */
    public function findRecentZafiraValidation(
        int $balanceId,
        int $balanceFlowTypeId,
        int $minutesInterval = 5,
        ?string $tripReference = null
    ) {
        $sql = "
            SELECT
                bf.*
            FROM balanceFlow bf
            WHERE
                bf.balanceId = :balanceId
                AND bf.balanceFlowTypeId = :balanceFlowTypeId
                AND bf.date >= :dateLimit
        ";

        $bind = [
            ':balanceId' => $balanceId,
            ':balanceFlowTypeId' => $balanceFlowTypeId,
            ':dateLimit' => date('Y-m-d H:i:s', strtotime("-{$minutesInterval} minutes")),
        ];

        if ($tripReference !== null && $tripReference !== '') {
            $sql .= ' AND bf.tripReference = :tripReference';
            $bind[':tripReference'] = $tripReference;
        }

        $sql .= '
            ORDER BY bf.date DESC
            LIMIT 1
        ';

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}