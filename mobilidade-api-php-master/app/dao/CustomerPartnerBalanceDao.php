<?php

namespace app\dao;

use app\constant\CustomerPartnerBalanceConst;
use app\constant\TripPaymentFormConst;
use app\utils\BaseDao;
use app\model\Config;
use app\model\ConfigType;
use app\model\Driver;
use Exception;
use app\model\Trip;
use app\model\TripAudit;
use app\model\Withdraw;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 17:20
 */
class CustomerPartnerBalanceDao extends BaseDao
{
    protected $table = "balance";

    /**
     * @param $idBalance
     * @param $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($idBalance, $fields = [])
    {
        try {
            return $this->sqlSelect($fields, [['idBalance', '=', $idBalance]])
                ->bind([':idBalance' => $idBalance])
                ->get(false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idBalance
     * @param \app\model\Trip $trip
     * @param $discountBalance
     * @return array|mixed
     * @throws Exception
     */
    public function returnWithheldBalanceByCancel($idBalance, Trip $trip, $discountBalance = false)
    {
        try {
            $value = $trip->getPrice();
            $cancellationFee = (float)Config::get('customer_partner_cancellation_fee', ConfigType::CUSTOMER_PARTNER);

            $discountValue = !$discountBalance ?
                $value :
                $value - $cancellationFee;

            $balance = $this->find($idBalance);
            $balance->tripBalance += $discountValue;
            $balance->withheldBalance -= $value;

            if ($balance->withheldBalance < 0)
                $balance->withheldBalance = 0;

            $this->sqlUpdate(
                [
                    'tripBalance' => ':tripBalance',
                    'withheldBalance' => ':withheldBalance'
                ],
                [['idBalance', '=', ':idBalance']],
                [
                    ':tripBalance' => $balance->tripBalance,
                    ':withheldBalance' => $balance->withheldBalance,
                    ':idBalance' => $idBalance
                ]
            );

            (new BalanceFlowDao)
                ->insert(
                    $discountValue,
                    CustomerPartnerBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION,
                    $idBalance,
                    $trip->getTripReference()
                );

            if ($discountBalance)
                $this->cancellationFee($idBalance, $trip->getTripReference(), $cancellationFee);

            return $this->find($idBalance);

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idBalance
     * @param $tripReference
     * @param null $cancellationFee
     * @return array|mixed
     * @throws Exception
     */
    public function cancellationFee($idBalance, $tripReference, $cancellationFee = null)
    {
        if (empty($cancellationFee))
            $cancellationFee = (float)Config::get('customer_partner_cancellation_fee', ConfigType::CUSTOMER_PARTNER);

        (new BalanceFlowDao)
            ->insert(
                $cancellationFee,
                CustomerPartnerBalanceConst::TRIP_CANCELLATION_FEE,
                $idBalance,
                $tripReference
            );

        return $this->find($idBalance);
    }

    /**
     * @param $trip
     * @param $balanceId
     * @param $cancelFee
     * @return array|mixed
     * @throws Exception
     */
    public function managePartnerBalanceOnCancel(Trip $trip, $balanceId, $cancelFee)
    {
        if ($trip->getTripPaymentFormId() == TripPaymentFormConst::VOUCHER)
            return $this->returnWithheldBalanceByCancel(
                $balanceId,
                $trip,
                $cancelFee
            );

        if ($cancelFee)
            return $this->cancellationFee($balanceId, $trip->getTripReference());
    }

    /**
     * @param $balanceId
     * @param \app\model\Driver $driver
     * @param \app\model\Trip $trip
     * @return array
     * @throws Exception
     */
    public function distributeBalanceAfterFinishTrip($balanceId, Driver $driver, Trip $trip)
    {
        switch ($trip->getTripPaymentFormId()) {
            case TripPaymentFormConst::VOUCHER:
                return $this->splitVoucherPayment($balanceId, $driver, $trip);
            case TripPaymentFormConst::MONEY_IN_CAR:
                return $this->splitMoneyInCarPayment($balanceId, $driver, $trip);
        }
    }

    /**
     * @param $balanceId
     * @param Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    public function returnWithheldBalanceByDriverCancel($balanceId, Trip $trip)
    {
        $value = $trip->getPrice();

        try {
            $balance = $this->find($balanceId);
            $balance->tripBalance += $value;
            $balance->withheldBalance -= $value;

            if ($balance->withheldBalance < 0)
                $balance->withheldBalance = 0;

            $this->sqlUpdate(
                [
                    'tripBalance' => $balance->tripBalance,
                    'withheldBalance' => $balance->withheldBalance
                ],
                [['idBalance', '=', $balanceId]]
            );

            (new BalanceFlowDao)
                ->insert($value, CustomerPartnerBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION, $balanceId, $trip->getTripReference());

            return $balance;

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param Withdraw $withdraw
     * @return array|mixed
     * @throws Exception
     */
    public function withdraw(Withdraw $withdraw)
    {
        $value = $withdraw->getValue();

        $balance = $this->find($withdraw->getBalanceId());
        $balance->balance -= $value;
        $balance->pendingBalanceWithdraw += $value;

        $this->sqlUpdate(
            [
                'pendingBalanceWithdraw' => ':pendingBalanceWithdraw',
                'balance' => ':balance'
            ],
            [['idBalance', '=', ':idBalance']],
            [
                ':pendingBalanceWithdraw' => $balance->pendingBalanceWithdraw,
                ':balance' => $balance->balance,
                ':idBalance' => $balance->idBalance
            ]
        );

        (new BalanceFlowDao)
            ->insertWithWithdraw(
                $value,
                CustomerPartnerBalanceConst::WITHDRAW,
                $withdraw->getBalanceId(),
                $withdraw->getIdWithdraw()
            );

        return $balance;
    }

    /**
     * DEPRECATED
     * @param $balanceId
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitVoucherPayment($balanceId, Driver $driver, Trip $trip)
    {
        $customerPartnerBalance = $this->subBalanceAfterFinishTrip($balanceId, $trip);

        return [
            'customerPartnerBalance' => $customerPartnerBalance,
            'driverBalance' => 0 // $driverBalance
        ];
    }

    /**
     * DEPRECATED
     * @param $balanceId
     * @param \app\model\Driver $driver
     * @param \app\model\Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitMoneyInCarPayment($balanceId, Driver $driver, Trip $trip)
    {
        $customerPartnerBalance = $this->addCommission($balanceId, $trip);

        return [
            'customerPartnerBalance' => $customerPartnerBalance,
            'driverBalance' => 0 //$driverBalance
        ];
    }

    /**
     * @param $balanceId
     * @param Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function subBalanceAfterFinishTrip($balanceId, Trip $trip)
    {
        $balance = $this->find($balanceId);
        $balance->withheldBalance -= $trip->getPrice();

        if ($balance->withheldBalance < 0)
            $balance->withheldBalance = 0;

        $this->sqlUpdate(
            ['withheldBalance' => $balance->withheldBalance],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $balanceId]
        );

        (new BalanceFlowDao)
            ->insert($trip->getPrice(), CustomerPartnerBalanceConst::BALANCE_OUT, $balanceId, $trip->getTripReference());

        return $this->find($balanceId);
    }

    /**
     * @param $balanceId
     * @param \app\model\Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function addCommission($balanceId, Trip $trip)
    {
        $customerPartnerPercentage = Config::get(
            'customer_partner_commission_money_in_car',
            ConfigType::CUSTOMER_PARTNER
        );
        $value = $this->percentage($trip->getPrice(), $customerPartnerPercentage);

        $balance = $this->find($balanceId);

        $property = "balance";
        $type = CustomerPartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = CustomerPartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR_ANALYSIS;
        }

        $balance->$property += $value;

        $this->sqlUpdate(
            [$property => ":$property"],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $balanceId, ":$property" => $balance->$property]
        );

        (new BalanceFlowDao)
            ->insert(
                $value,
                $type,
                $balanceId,
                $trip->getTripReference()
            );

        return $balance;
    }

    private function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }
}