<?php

namespace app\services;

use app\constant\TripCancellationFeeTypeConst;
use app\constant\TripCallTypeConst;
use app\dao\CityConfigDao;
use app\dao\LevelAccessDao;
use app\dao\TripCancellationCustomerFeeDao;
use app\dao\TripCancellationFeeTypeDao;
use app\dao\TripDao;
use app\utils\DirectionService;
use app\utils\Headers;
use app\model\CityConfig;
use app\model\Driver;
use Exception;
use app\model\Location;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripCancellationCustomerFee;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/04/2019
 * Time: 15:05
 */
class TripCancellationCustomerFeeService
{
    private $dao;
    private $cityConfigDao;
    private $config;
    private $levelAccessDao;
    private $cancellationFeeType;

    public function __construct()
    {
        $this->dao = new TripCancellationCustomerFeeDao;
        $this->cancellationFeeType = new TripCancellationFeeTypeDao;
        $this->cityConfigDao = new CityConfigDao;
        $this->levelAccessDao = new LevelAccessDao;
    }

    /**
     * @param Trip $trip
     * @param Driver $driver
     * @param \app\model\Location $origin
     * @return bool|\app\model\TripCancellationCustomerFee
     * @throws Exception
     */
    public function insert(Trip $trip, Driver $driver, Location $origin)
    {
        $feeTypeId = $this->validateCancellationFee($trip, $driver, $origin);

        if ($feeTypeId) {
            $cancellationFee = $this->create($trip, $feeTypeId);
            return $cancellationFee;
        }

        return $feeTypeId;
    }

    /**
     * @param $tripReference
     * @return bool|TripCancellationCustomerFee
     * @throws Exception
     */
    public function check($tripReference)
    {
        $trip = (new TripDao)->find($tripReference);

        $this->validateCancelTrip($trip->status);

        $feeTypeId = $this->validateCancellationFee(
            new Trip($trip), new Driver($trip->driver), new Location($trip->origin));

        if ($feeTypeId) {
            /** @var \app\model\TripCancellationCustomerFee $cancellationFee */
            $cancellationFee = $this->create(new Trip($trip), $feeTypeId, false);

            if ($cancellationFee) {
                $type = $this->cancellationFeeType
                    ->find($cancellationFee->getTripCancellationFeeTypeId());

                $cancellationFee = $cancellationFee->toStdClass();
                $cancellationFee->type = $type;

                return $cancellationFee;
            }
        }

        return $feeTypeId;
    }

    /**
     * @param \app\model\TripCancellationCustomerFee $cancellationFee
     * @param Trip $trip
     * @param null|\app\model\Transaction $transaction
     * @return bool
     * @throws Exception
     */
    public function putToScheduledTransfer(TripCancellationCustomerFee $cancellationFee, Trip $trip,
                                           ?Transaction                $transaction = null)
    {
        $daysToTransfer = $this->getConfig($trip->getCityId())
            ->getDaysToBillCancellationFee();

        $scheduledDate = addDays($cancellationFee->getCreatedAt(), $daysToTransfer);

        return $this->dao
            ->putToScheduledTransfer($cancellationFee->getId(), $scheduledDate,
                $transaction ? $transaction->getIdTransaction() : null);
    }

    /**
     * @param $cityId
     * @return \app\model\CityConfig
     */
    private function getConfig($cityId = null): CityConfig
    {
        $this->config = $this->config ?? new CityConfig(
                $this->cityConfigDao
                    ->getByCity($cityId));

        return $this->config;
    }

    /**
     * Se for válido, retorna o tipo do cancelamento
     * @param Trip $trip
     * @param \app\model\Driver $driver
     * @param \app\model\Location $origin
     * @param null $userId
     * @return bool
     * @throws Exception
     */
    private function validateCancellationFee(Trip $trip, Driver $driver, Location $origin, $userId = null)
    {
//        if (!in_array($trip->getDriverId(), DriversForCancellationFeeConst::IDS))
//            return null;

        // Não aplicamos taxa de cancelamento para corridas do tipo maçaneta manual
        if ($trip->getTripCallTypeId() == TripCallTypeConst::MACANETA) {
            return null;
        }
        
        $config = $this->getConfig($trip->getCityId());
        $userId = $userId ?? Headers::getUserId();
        $userType = $this->levelAccessDao->getType($userId);

        if (((bool)$userType->isDriver) &&
            $trip->getStatus() == Trip::BOARDING &&
            $config->getCancellationCustomerFeeValue() > 0 &&
            !in_array($trip->getTripAuditId(), [TripAudit::BLOCKED, TripAudit::IN_ANALYSIS]))
            return $this->cancellationFeeByExpiredDriverWaiting($trip);

        if ($config->getCancellationCustomerFeeValue() > 0 &&
            in_array($trip->getStatus(), [
                Trip::ACCEPTED, Trip::BOARDING
            ]) &&
            !((bool)$userType->isDriver))
            return $this->cancellationFeeByExpiredTime($trip, $driver, $origin);

        return null;
    }

    /**
     * @param Trip $trip
     * @param \app\model\Driver $driver
     * @param \app\model\Location $origin
     * @return int|null
     * @throws Exception
     */
    private function cancellationFeeByExpiredTime(Trip $trip, Driver $driver, Location $origin)
    {
        if (!$trip->getEstimatedTimeDriverArrival())
            return null;

        $mapsApi = new DirectionService;

        $estimative = $mapsApi
            ->getDistance(
                $driver->getLastLat(), $driver->getLastLon(),
                $origin->getLatitude(), $origin->getLongitude()
            );

        $driverProgressMade = 100 - $this->percentage_nx(
                $estimative->duration,
                $trip->getEstimatedTimeDriverArrival());

        if ($driverProgressMade > $this->getConfig()->getRoutePercentageCancellationFee())
            return TripCancellationFeeTypeConst::DRIVER_MOVING_STARTED;

        return null;
    }

    /**
     * @param Trip $trip
     * @return int|null
     */
    private function cancellationFeeByExpiredDriverWaiting(Trip $trip)
    {
        $config = $this->getConfig();
        $timeWaitingCustomer = diffInSeconds($trip->getDate(), now());

        if ($timeWaitingCustomer > $config->getWaitingTimeCustomerCancellationFee())
            return TripCancellationFeeTypeConst::DRIVER_WAITING_TIME_EXPIRED;

        return null;
    }

    /**
     * @param Trip $trip
     * @param int $feeTypeId
     * @param bool $persist
     * @return \app\model\TripCancellationCustomerFee
     */
    private function create(Trip $trip, int $feeTypeId, $persist = true): TripCancellationCustomerFee
    {
        $cancellationFee = new TripCancellationCustomerFee;
        $cancellationFee
            ->setDriverId($trip->getDriverId())
            ->setTripReference($trip->getTripReference())
            ->setFeeValue(
                $this->getConfig()
                    ->getCancellationCustomerFeeValue())
            ->setTripCancellationFeeTypeId($feeTypeId)
            ->setUserId($trip->getUserId());

        if ($persist)
            $cancellationFee
                ->setId($this->dao
                    ->sqlInsert($cancellationFee));

        return $cancellationFee;
    }

    /**
     * Calcula porcentagem
     * N É X% DE N
     * exemplo: "2.42 é X% de 22?".
     * @param $partial
     * @param $total
     * @return float|int
     */
    private function percentage_nx($partial, $total)
    {
        return ($partial / $total) * 100;
    }

    /**
     * @param $status
     * @throws Exception
     */
    private function validateCancelTrip($status)
    {
        if ($status == Trip::CANCELED)
            throw new Exception("Viagem já cancelada");

        if ($status == Trip::FINISHED)
            throw new Exception("Viagem já finalizada");

        if ($status == Trip::IN_PROGRESS)
            throw new Exception("Viagem em andamento, a mesma não pode ser cancelada");
    }
}