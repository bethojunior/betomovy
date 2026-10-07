<?php

namespace app\dao;

use app\constant\CommissionTypeConst;
use app\constant\TripPaymentFormConst;
use app\exceptions\DriverCommissionException;
use app\services\DriverCommissionService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\model\Config;
use app\model\ConfigType;
use app\model\DriverCommission;
use Exception;
use app\model\Trip;
use app\model\TripFinancialDetail;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/11/2018
 * Time: 10:44
 */
class TripFinancialDetailDao extends BaseDao
{
    protected $table = "tripFinancialDetail";
    private $driverCommissionService;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->driverCommissionService = new DriverCommissionService;
        parent::__construct($conn, $sql);
    }

    public function find($tripReference)
    {
        $tripTable = (new Trip)->getTableName();

        $sql = "
            SELECT
                tF.driverCommission,
                tF.partnerCommission,
                tF.appCommission,
                t.price
            FROM {$this->table} tF
              INNER JOIN {$tripTable} t ON tF.tripReference = t.tripReference
            WHERE tF.tripReference = :tripReference
        ";

        return $this->sqlRawSelect($sql, [':tripReference' => $tripReference])
            ->get(false);
    }

    /**
     * @param \app\model\Trip $trip
     * @return \app\model\TripFinancialDetail
     * @throws Exception
     */
    public function insertByPartnerTrip(Trip $trip): TripFinancialDetail
    {
        $financialDetail = new TripFinancialDetail;
        $financialDetail
            ->setTripReference($trip->getTripReference())
            ->setDriverCommission(
                $this->driverCommissionByPartnerTrip($trip)
            )
            ->setPartnerCommission(
                $this->partnerCommissionByPaymentForm($trip)
            )
            ->setAppCommission(
                $this->calculateAppCommission(
                    $trip, $financialDetail->getDriverCommission(), $financialDetail->getPartnerCommission())
            )
            ->setIdTripFinancialDetail($this->sqlInsert($financialDetail));

        return $financialDetail;
    }

    /**
     * @param \app\model\Trip $trip
     * @return \app\model\TripFinancialDetail
     * @throws Exception
     */
    public function insertByCustomerTrip(Trip $trip): TripFinancialDetail
    {
        $commission = $this->driverCommissionService
            ->find($trip->getDriverCommissionId());

        $financialDetail = new TripFinancialDetail;
        $financialDetail
            ->setTripReference($trip->getTripReference())
            ->setDriverCommission(
                $this->calculateCommission($commission, $trip)
            )
            ->setAppCommission(
                $this->calculateAppCommission($trip, $financialDetail->getDriverCommission())
            )
            ->setIdTripFinancialDetail($this->sqlInsert($financialDetail));

        return $financialDetail;
    }

    /**
     * @param \app\model\Trip $trip
     * @return float|int
     * @throws Exception
     */
    private function driverCommissionByCustomerTrip(Trip $trip)
    {
        $driverPercentage = (float)Config::get('driver_percentage_customer_trip_value', ConfigType::DRIVER);

        return $this->calculatePercentage($driverPercentage, $trip->getPrice());
    }

    /**
     * Comissão do motorista quando o
     * solicitante da viagem for um parceiro
     * @param \app\model\Trip $trip
     * @return float|int
     * @throws Exception
     */
    private function driverCommissionByPartnerTrip(Trip $trip)
    {
        $driverPercentage = (float)Config::get('driver_percentage_trip_value', ConfigType::DRIVER);

        return $this->calculatePercentage($driverPercentage, $trip->getPrice());
    }

    /**
     * Comissão do parceiro, caso a corrida seja voucher ele nao recebe comissao
     * caso seja outra forma de pagamento ele recebe a porcentagem
     * @param \app\model\\app\model\Trip $trip
     * @return float|int
     * @throws Exception
     */
    private function partnerCommissionByPaymentForm(Trip $trip)
    {
        if ($trip->getTripPaymentFormId() == TripPaymentFormConst::VOUCHER)
            return 0;

        $partnerPercentage = (float)Config::get('customer_partner_commission_money_in_car', ConfigType::CUSTOMER_PARTNER);

        return $this->calculatePercentage($partnerPercentage, $trip->getPrice());
    }

    /**
     * @param DriverCommission $driverCommission
     * @param \app\model\Trip $trip
     * @return float|int|mixed
     * @throws DriverCommissionException
     */
    private function calculateCommission(DriverCommission $driverCommission, Trip $trip)
    {
        switch ($driverCommission->getValueType()) {
            case CommissionTypeConst::PERCENTAGE:
                return $this->calculatePercentage($trip->getPrice(), $driverCommission->getValue());
            case CommissionTypeConst::FIXED_VALUE:
                return $trip->getPrice() - $driverCommission->getValue();
            default:
                throw new DriverCommissionException(
                    1352,
                    ['driverCommission' => $driverCommission->toStdClass()]
                );
        }
    }

    /**
     * @param \app\model\Trip $trip
     * @param float $driverCommission
     * @param float $partnerCommission
     * @return float|mixed
     */
    private function calculateAppCommission(Trip $trip, float $driverCommission, float $partnerCommission = 0)
    {
        return $trip->getPrice() - ($driverCommission + $partnerCommission);
    }

    /**
     * Calcula porcentagem
     * @param $percentage
     * @param $value
     * @return float|int
     */
    private function calculatePercentage($percentage, $value)
    {
        return $value * ($percentage / 100);
    }
}