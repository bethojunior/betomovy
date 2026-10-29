<?php

namespace app\dao;

use app\constant\DriverBalanceConst;
use app\constant\EmployeeBalanceConst;
use app\constant\EstablishmentBalanceConst;
use app\constant\TripPaymentFormConst;
use app\utils\BaseDao;
use app\model\Config;
use app\model\ConfigType;
use app\model\Customer;
use app\model\Driver;
use app\model\Establishment;
use app\model\Trip;
use app\model\TripAudit;
use app\model\Withdraw;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 13/08/2018
 * Time: 08:47
 */
class BalanceDao extends BaseDao
{
    /**
     * @param $idBalance
     * @param $value
     * @return array|mixed
     * @throws Exception
     */
    public function addBalanceByRecharge($idBalance, $value)
    {
        try {
            $balance = $this->find($idBalance);
            $balance->tripBalance += $value;

            $this->sqlUpdate(
                ['tripBalance' => $balance->tripBalance],
                [['idBalance', '=', ':idBalance']],
                [':idBalance' => $idBalance]
            );

            (new BalanceFlowDao)
                ->insert($value, EstablishmentBalanceConst::BALANCE_ENTRY_RECHARGE, $idBalance);

            return $this->find($idBalance);

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idBalance
     * @param $tripBalance
     * @throws Exception
     */
    public function updateTripBalance($idBalance, $tripBalance)
    {
        $this->sqlUpdate(
            ['tripBalance' => $tripBalance],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $idBalance]
        );
    }

    /**
     * @param $idBalance
     * @param \app\model\Trip $trip
     * @param $balanceType
     * @return array|mixed
     * @throws Exception
     */
    public function subBalanceForNewTrip($idBalance, Trip $trip, $balanceType)
    {
        $currentBalance = $this->find($idBalance);
        $price = (float)$trip->getPrice();
        $tripBalance = (float)($currentBalance->tripBalance ?? 0);
        $walletBalance = (float)($currentBalance->balance ?? 0);

        // Deduz primeiro do voucher/tripBalance; se não cobrir, deduz o restante da carteira
        if ($tripBalance >= $price) {
            $deductTripBalance = $price;
            $deductBalance = 0;
        } else {
            $deductTripBalance = max(0, $tripBalance);
            $deductBalance = $price - $deductTripBalance;
        }

        $newTripBalance = $tripBalance - $deductTripBalance;
        $newWalletBalance = $walletBalance - $deductBalance;
        $withheldBalance = (float)($currentBalance->withheldBalance ?? 0) + $price;

        $this->sqlUpdate(
            [
                'tripBalance' => ':tripBalance',
                'balance' => ':balance',
                'withheldBalance' => ':withheldBalance'
            ],
            [['idBalance', '=', ':idBalance']],
            [
                ':idBalance' => $idBalance,
                ':tripBalance' => $newTripBalance,
                ':balance' => $newWalletBalance,
                ':withheldBalance' => $withheldBalance
            ]
        );

        (new BalanceFlowDao)
            ->insert($trip->getPrice(), $balanceType, $idBalance, $trip->getTripReference());

        return $this->find($idBalance);
    }

    public function subBalanceForNewTripCentral($idBalance, Trip $trip, $balanceType)
    {
        $this->sqlUpdate(
            [
                'tripBalance' => 'tripBalance - :price',
                'withheldBalance' => 'withheldBalance + :price'
            ],
            [['idBalance', '=', ':idBalance']],
            [
                ':idBalance' => $idBalance,
                ':price' => (float)$trip->getPrice()
            ]
        );

        (new BalanceFlowDao)
            ->insert($trip->getPrice(), $balanceType, $idBalance, $trip->getTripReference());

        return $this->find($idBalance);
    }

    /**
     * @param Establishment $establishment
     * @param Driver $driver
     * @param \app\model\Trip $trip
     * @return array
     * @throws Exception
     */
    public function distributeBalanceAfterFinishTrip(Establishment $establishment, Driver $driver, Trip $trip)
    {
        switch ($trip->getTripPaymentFormId()) {
            case TripPaymentFormConst::VOUCHER:
                return $this->splitVoucherPayment($establishment, $driver, $trip);
            case TripPaymentFormConst::MONEY_IN_CAR:
                return $this->splitMoneyInCarPayment($establishment, $driver, $trip);
        }
    }

    /**
     * @param $idBalance
     * @param Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    public function returnWithheldBalanceByDriverCancel($idBalance, Trip $trip)
    {
        $value = $trip->getPrice();

        try {
            $balance = $this->find($idBalance);
            $balance->tripBalance += $value;
            $balance->withheldBalance -= $value;

            if ($balance->withheldBalance < 0)
                $balance->withheldBalance = 0;

            $this->sqlUpdate(
                [
                    'tripBalance' => $balance->tripBalance,
                    'withheldBalance' => $balance->withheldBalance
                ],
                [['idBalance', '=', $idBalance]]
            );

            (new BalanceFlowDao)
                ->insert($value, EstablishmentBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION, $idBalance, $trip->getTripReference());

            return $this->find($idBalance);

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idBalance
     * @param Trip $trip
     * @param $discountBalance
     * @return array|mixed
     * @throws Exception
     */
    public function returnWithheldBalanceByEstablishmentCancel($idBalance, Trip $trip, $discountBalance = false)
    {
        try {
            $value = $trip->getPrice();
            $cancellationFee = (float)Config::get(Config::CANCELLATION_FEE, ConfigType::ESTABLISHMENT);

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
                    EstablishmentBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION,
                    $idBalance,
                    $trip->getTripReference()
                );

            if ($discountBalance)
                $this->establishmentCancellationFee($idBalance, $trip->getTripReference(), $cancellationFee);

            return $this->find($idBalance);

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idBalance
     * @param array $fields
     * @return array|mixed
     */
    public function find($idBalance, $fields = [])
    {
        return $this->sqlSelect($fields, [['idBalance', '=', $idBalance]])
            ->bind([':idBalance' => $idBalance])
            ->get(false);
    }

    /**
     * Encontrar saldo pelo ID do motorista
     * @param $driverId
     * @return array|mixed
     */
    public function findByDriver($driverId)
    {
        $driverTable = (new Driver)->getTableName();
        $sql = "
            SELECT
              b.idBalance,
              b.balance,
              b.pendingBalanceWithdraw,
              b.blockedBalance,
              b.tripBalance
            FROM {$this->table} b
              INNER JOIN {$driverTable} d ON d.balanceId = b.idBalance 
            WHERE d.idDriver = :driverId
            LIMIT 1
        ";

        try {
            $pdo = \app\utils\Connection::open(\app\utils\Connection::DB_MYSQL_RW);
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':driverId' => (int)$driverId]);
            $res = $stmt->fetch(\PDO::FETCH_OBJ);
            return $res ?: null;
        } catch (\Throwable $e) {
            return $this->sqlRawSelect($sql, [
                ':driverId' => $driverId
            ])->get(false);
        }
    }

    /**
     * Encontrar saldo pelo ID do cliente / parceiro
     * @param $customerId
     * @return array|mixed
     */
    public function findByPartner($customerId)
    {
        $customerTable = (new Customer)->getTableName();
        $sql = "
            SELECT
              b.idBalance,
              b.balance,
              b.pendingBalanceWithdraw,
              b.blockedBalance
            FROM {$this->table} b
              INNER JOIN {$customerTable} c ON c.balanceId = b.idBalance 
            WHERE c.idCustomer = :customerId
        ";

        return $this->sqlRawSelect($sql, [
            ':customerId' => $customerId
        ])
            ->get(false);
    }

    /**
     * @param \app\model\Withdraw $withdraw
     * @return array|mixed
     * @throws Exception
     */
    public function driverWithdraw(Withdraw $withdraw)
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
                DriverBalanceConst::WITHDRAW,
                $withdraw->getBalanceId(),
                $withdraw->getIdWithdraw()
            );

        return $balance;
    }

    /**
     * @param $idBalance
     * @param $tripReference
     * @param null $cancellationFee
     * @return array|mixed
     * @throws Exception
     */
    public function establishmentCancellationFee($idBalance, $tripReference, $cancellationFee = null)
    {
        if (empty($cancellationFee))
            $cancellationFee = (float)Config::get(Config::CANCELLATION_FEE, ConfigType::ESTABLISHMENT);

        (new BalanceFlowDao)
            ->insert(
                $cancellationFee,
                EstablishmentBalanceConst::TRIP_CANCELLATION_FEE,
                $idBalance,
                $tripReference
            );

        return $this->find($idBalance);
    }

    /**
     * DEPRECATED
     * @param Establishment $establishment
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitMoneyInCarPayment(Establishment $establishment, Driver $driver, Trip $trip)
    {
        $this->addEstablishmentCommission(
            $establishment->getBalanceId(), $trip);

        $employeePercentage = Config::get(
            'employee_commission_money_in_car',
            ConfigType::TRIP
        );
        $employeeBalance = $this->addEmployeeCommission($employeePercentage, $trip);

        return [
            'establishmentBalance' => 0,
            'employeeBalance' => $employeeBalance,
            'driverBalance' => 0 #$driverBalance
        ];
    }

    /**
     * DEPRECATED
     * @param \app\model\Establishment $establishment
     * @param Driver $driver
     * @param Trip $trip
     * @return array
     * @throws Exception
     */
    private function splitVoucherPayment(Establishment $establishment, Driver $driver, Trip $trip)
    {
        $establishmentBalance = $this->subEstablishmentBalanceAfterFinishTrip(
            $establishment->getBalanceId(), $trip);

        return [
            'establishmentBalance' => $establishmentBalance,
            'driverBalance' => 0 //$driverBalance
        ];
    }

    /**
     * @param $idBalance
     * @param Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function subEstablishmentBalanceAfterFinishTrip($idBalance, Trip $trip)
    {
        $balance = $this->find($idBalance);
        $balance->withheldBalance -= $trip->getPrice();

        if ($balance->withheldBalance < 0)
            $balance->withheldBalance = 0;

        $this->sqlUpdate(
            ['withheldBalance' => $balance->withheldBalance],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $idBalance]
        );

        (new BalanceFlowDao)
            ->insert($trip->getPrice(), EstablishmentBalanceConst::BALANCE_OUT, $idBalance, $trip->getTripReference());

        $employeePercentage = (float)Config::get(
            'employee_commission_voucher_payment',
            ConfigType::TRIP
        );
        $this->addEmployeeCommission($employeePercentage, $trip);

        return $this->find($idBalance);
    }

    /**
     * @param $idBalance
     * @param \app\model\Trip $trip
     * @throws Exception
     */
    private function addEstablishmentCommission($idBalance, Trip $trip)
    {
        $establishmentPercentage = Config::get(
            'establishment_commission_money_in_car',
            ConfigType::TRIP
        );
        $value = $this->percentage($trip->getPrice(), $establishmentPercentage);

        $balance = $this->find($idBalance);

        $property = "tripBalance";
        $type = EstablishmentBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "withheldBalance";
            $type = EstablishmentBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR_ANALYSIS;
        }

        $balance->$property += $value;

        $this->sqlUpdate(
            [$property => ":$property"],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $idBalance, ":$property" => $balance->$property]
        );

        (new BalanceFlowDao)
            ->insert(
                $value,
                $type,
                $idBalance,
                $trip->getTripReference()
            );
    }

    /**
     * @param $percentage
     * @param Trip $trip
     * @return array|float|int|mixed
     * @throws Exception
     */
    private function addEmployeeCommission($percentage, Trip $trip)
    {
        $value = $this->percentage($trip->getPrice(), $percentage);

        $employee = (new EmployeeDao)->findByUserId($trip->getUserId());
        $balance = $this->find($employee->balanceId);

        $property = "balance";
        $type = EmployeeBalanceConst::BALANCE_ENTRY_BY_CALL_TRIP;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = EmployeeBalanceConst::BALANCE_ENTRY_BLOCKED_CALL_TRIP_ANALYSIS;
        }

        $balance->$property += $value;

        $this->sqlUpdate(
            [$property => ":$property"],
            [['idBalance', '=', ':idBalance']],
            [':idBalance' => $employee->balanceId, ":$property" => $balance->$property]
        );

        (new BalanceFlowDao)
            ->insert(
                $value,
                $type,
                $employee->balanceId,
                $trip->getTripReference()
            );

        return $balance;
    }

    private function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }

    /**
     * @param $idBalance
     * @param $value
     * @param array $properties
     * @param array $operators
     * @throws Exception
     */
    public function update($idBalance, $value, array $properties = ["balance"], array $operators = ['+'])
    {
        $set = [];
        $bind[':idBalance'] = $idBalance;

        foreach ($properties as $index => $property) {
            $set += [
                $property => "ROUND({$property} {$operators[$index]} :{$property}, 2)"
            ];

            $bind += [
                ":{$property}" => $value
            ];
        }

        $this->sqlUpdate(
            $set,
            [['idBalance', '=', ':idBalance']],
            $bind
        );
    }
}