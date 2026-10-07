<?php

namespace app\dao;

use app\constant\CompanyBalanceConst;
use app\constant\CustomerBalanceConst;
use app\services\TripCancellationCustomerFeeService;
use app\utils\BaseDao;
use app\utils\Connection;
use Exception;
use app\model\Trip;
use app\model\TripCancellationCustomerFee;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/10/2018
 * Time: 00:56
 */
class CustomerBalanceDao extends BaseDao
{
    protected $table = 'balance';

    private $tripCancellationCustomerFeeService;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->tripCancellationCustomerFeeService = new TripCancellationCustomerFeeService;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $idBalance
     * @param $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($idBalance, $fields = [])
    {
        return $this->sqlSelect($fields, [['idBalance', '=', $idBalance]])
            ->bind([':idBalance' => $idBalance])
            ->get(false);
    }

    /**
     * @param $balanceId
     * @param Trip $trip
     * @param bool $administrative
     * @return array|mixed
     * @throws Exception
     */
    public function subBalanceAfterFinishTrip($balanceId, Trip $trip, bool $administrative = false)
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
            ->insert(
                $trip->getPrice(),
                ($administrative ?
                    CompanyBalanceConst::TRIP_BALANCE_OUT :
                    CustomerBalanceConst::BALANCE_OUT),
                $balanceId,
                $trip->getTripReference());

        return $this->find($balanceId);
    }

    /**
     * @param \app\model\Trip $trip
     * @param $balanceId
     * @param null|\app\model\TripCancellationCustomerFee $cancelFee
     * @param bool $administrative
     * @return array|mixed
     * @throws Exception
     */
    public function manageBalanceOnCancel(Trip                         $trip, $balanceId,
                                          ?TripCancellationCustomerFee $cancelFee = null, bool $administrative = false)
    {
        return $this->returnWithheldBalanceByCancel(
            $balanceId,
            $trip,
            $cancelFee,
            $administrative
        );
    }

    /**
     * @param $idBalance
     * @param Trip $trip
     * @param bool|\app\model\TripCancellationCustomerFee $discountBalance
     * @param bool $administrative
     * @return array|mixed
     * @throws Exception
     */
    private function returnWithheldBalanceByCancel($idBalance, Trip $trip,
                                                   ?TripCancellationCustomerFee $discountBalance = null, $administrative = false)
    {
        $value = $trip->getPrice();

        $balance = $this->find($idBalance);
        $balance->tripBalance +=
            ($discountBalance && $balance->tripBalance > $discountBalance->getFeeValue() ?
                ($value - $discountBalance->getFeeValue()) :
                $value);
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
                $value,
                ($administrative ?
                    CompanyBalanceConst::VOUCHER_RETURN_UNFINISHED_TRIP :
                    CustomerBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION),
                $idBalance, $trip->getTripReference());

        if ($discountBalance && $balance->tripBalance > $discountBalance->getFeeValue())
            $this->cancellationFee($idBalance, $trip, $discountBalance);

        return $balance;
    }

    /**
     * @param $idBalance
     * @param \app\model\Trip $trip
     * @param \app\model\TripCancellationCustomerFee $cancellationFee
     * @return array|mixed
     * @throws Exception
     */
    private function cancellationFee($idBalance, Trip $trip, TripCancellationCustomerFee $cancellationFee)
    {
        $this->tripCancellationCustomerFeeService
            ->putToScheduledTransfer($cancellationFee, $trip);

        (new BalanceFlowDao)
            ->insert(
                $cancellationFee->getFeeValue(),
                CustomerBalanceConst::TRIP_CANCELLATION_FEE,
                $idBalance,
                $trip->getTripReference()
            );

        return $cancellationFee;
    }
}