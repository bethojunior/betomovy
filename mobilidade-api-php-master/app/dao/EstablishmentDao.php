<?php

namespace app\dao;

use app\exceptions\InvalidFieldEstablishmentException;
use app\services\EstablishmentService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\utils\DirectionService;
use app\validator\BankAccountValidator;
use app\validator\EstablishmentValidator;
use app\model\Balance;
use app\model\BankAccount;
use app\model\Card;
use app\model\City;
use app\model\Establishment;
use app\model\EstablishmentRecharge;
use Exception;
use app\model\RoutePrice;
use app\model\Station;
use app\model\StationType;
use app\model\Transaction;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 10/07/2018
 * Time: 15:37
 */
class EstablishmentDao extends BaseDao
{
    const LIMIT_RANKING_ESTABLISHMENT = 4;

    private $service;
    private $validator;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->service = new EstablishmentService;
        $this->validator = new EstablishmentValidator;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $data
     * @param $photos
     * @return bool
     * @throws Exception
     */
    public function register($data, $photos)
    {
        try {
            $this->beginTransaction();

            $employeeDao = new EmployeeDao;

            $establishmentId = $this->createNew($data->establishment, $photos);

            foreach ($data->establishment->employees as $employee) {
                $employeeDao->createNew($employee, $establishmentId, $employee->userTypeId);
            }

            return $this->commit();
        } catch (Exception $e) {
            $this->rollBack();
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $data
     * @param $photos
     * @return string
     * @throws Exception
     * @throws InvalidFieldEstablishmentException
     */
    public function createNew($data, $photos)
    {
        try {
            $this->validator->validateEstablishment($data);

            $this->checkEstablishmentEmails($data->commercialEmail, $data->administratorEmail);

            if (empty($photos))
                throw new InvalidFieldEstablishmentException("Nenhuma foto do estabelecimento foi enviada", 'photos');

            (new BankAccountValidator)->validateBankAccount($data->bankAccount);

            $establishment = new Establishment($data);
            $establishment->setPhotos($photos);

            /** @var BankAccount $bankAccount */
            $bankAccount = (new BankAccountDao)->create($data->bankAccount);

            /** @var Balance $balance */
            $balance = (new BalanceDao)->create();

            $establishment->setBankAccountId($bankAccount->getIdBankAccount());
            $establishment->setBalanceId($balance->getIdBalance());

            return $this->sqlInsert($establishment);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     * @return \app\model\Establishment
     * @throws InvalidFieldEstablishmentException
     * @throws Exception
     */
    public function createPreRegister($data): Establishment
    {
        $this->validator->validatePreRegisterEstablishment($data);

        $establishment = new Establishment($data);

        /** @var \app\model\Balance $balance */
        $balance = (new BalanceDao)->create();

        $establishment->setBalanceId($balance->getIdBalance());
        $establishment->setIdEstablishment($this->sqlInsert($establishment));

        return $establishment;
    }

    /**
     * @param $establishmentId
     * @return array|mixed
     * @throws Exception
     */
    public function routePrice($establishmentId)
    {
        $routePriceTable = (new RoutePrice)->getTableName();
        $stationTable = (new Station)->getTableName();
        $stationTypeTable = (new StationType)->getTableName();

        try {
            $stations = $this->sqlRawSelect("SELECT 
              {$routePriceTable}.establishmentId,
              {$routePriceTable}.stationId,
              {$routePriceTable}.price,
              {$stationTable}.idStation,
              {$stationTable}.name,
              {$stationTable}.stationTypeId,
              {$stationTable}.latitude,
              {$stationTable}.longitude,
              {$stationTypeTable}.name AS stationTypeName
              FROM {$routePriceTable}
              INNER JOIN {$stationTable} ON {$routePriceTable}.stationId = {$stationTable}.idStation
              INNER JOIN {$stationTypeTable} ON {$stationTable}.stationTypeId = {$stationTypeTable}.idStationType
              WHERE {$routePriceTable}.establishmentId = :establishmentId;
            ", [":establishmentId" => $establishmentId])->get();

            $establishment = new Establishment;

            return $establishment->getSeparatedStations($stations);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $cityId
     * @param $neighborhood
     * @param array $prices
     * @return array|mixed
     * @throws Exception
     */
    public function getByFilter($cityId, $neighborhood, array $prices)
    {
        if (count($prices) < 2)
            throw new Exception("Preços inválidos");

        try {
            $baseSql = "
            SELECT 
                idEstablishment,
                fantasyName,
                address,
                number,
                zipcode,
                neighborhood,
                cityId,
                estateId,
                rating,
                maxDailyRate,
                minDailyRate,
                averageValue,
                commercialEmail,
                commercialPhone,
                cellPhone,
                photos,
                indicationDiscount,
                indicationValue,
                indicationDiscountType
            FROM {$this->table}
                WHERE cityId = :cityId ";

            $sql = $baseSql . "AND neighborhood LIKE '%{$neighborhood}%' 
                AND (averageValue >= :minAverageValue AND averageValue <= :maxAverageValue) 
                ORDER BY indicationValue DESC";

            $establishments = $this->sqlRawSelect($sql, [
                ":cityId" => $cityId,
                ":minAverageValue" => $prices[0],
                ":maxAverageValue" => $prices[1]
            ])->get();

            if (empty($establishments))
                $establishments = $this->sqlRawSelect($baseSql . "ORDER BY indicationValue DESC", [":cityId" => $cityId])->get();

            return $establishments;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $cityId
     * @return array|mixed
     */
    public function getByCommissionValue(int $cityId)
    {
        $limit = self::LIMIT_RANKING_ESTABLISHMENT;

        $sql = "SELECT
                idEstablishment,
                fantasyName,
                address,
                number,
                zipcode,
                neighborhood,
                rating,
                maxDailyRate,
                minDailyRate,
                averageValue,
                commercialPhone,
                photos,
                indicationDiscount,
                indicationValue,
                indicationDiscountType,
                indicationCommissionType
            FROM establishment
              WHERE cityId = :cityId
              ORDER BY indicationCommissionType ASC, indicationValue DESC LIMIT {$limit}";

        $establishments = $this->sqlRawSelect($sql, [':cityId' => $cityId])
            ->get();

        return array_map(function ($establishment) {
            $establishment->photos = explode(",", $establishment->photos);
            return $establishment;
        }, $establishments);
    }

    /**
     * @param $idEstablishment
     * @param array $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($idEstablishment, $fields = [])
    {
        try {
            $establishment = $this->sqlSelect($fields, [['idEstablishment', '=', $idEstablishment]])->get(false);

            if (empty($establishment))
                throw new Exception("Estabelecimento não encontrado");

            if (isset($establishment->balanceId))
                $establishment->balance = (new BalanceDao)
                    ->sqlSelect(
                        ['tripBalance', 'blockedBalance'],
                        [['idBalance', '=', ':idBalance']]
                    )
                    ->bind([':idBalance' => $establishment->balanceId])
                    ->get(false);

            return $establishment;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idEstablishment
     * @param $idUser
     * @return array|mixed
     * @throws Exception
     *
     */
    public function findWithUser($idEstablishment, $idUser)
    {
        $resultSql = $this->service->getSqlForFindWithUser($idEstablishment, $idUser);

        $establishment = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if (empty($establishment))
            throw new Exception("Estabelecimento não encontrado");

        return $establishment;
    }

    /**
     * @param null $estateId
     * @return array
     * @throws Exception
     */
    public function getCities($estateId = null)
    {
        try {
            $cityTable = (new City)->getTableName();

            $sql = "SELECT DISTINCT {$cityTable}.nome, {$cityTable}.id AS cityId FROM {$this->table}
                  INNER JOIN {$cityTable} ON {$this->table}.cityId = {$cityTable}.id ";

            if (!empty($estateId))
                $sql .= " WHERE {$cityTable}.estado = {$estateId} ";

            $sql .= "ORDER BY nome ASC";

            return $this->sqlRawSelect($sql)->get();

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $cityId
     * @return array|mixed
     * @throws Exception
     */
    public function getNeighborhoods($cityId = null)
    {
        try {
            $sql = "SELECT DISTINCT neighborhood FROM establishment";

            if (!empty($cityId))
                $sql .= " WHERE cityId = {$cityId}";

            return array_map(function ($obj) {
                return $obj->neighborhood;
            }, $this->sqlRawSelect($sql)->get());

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $cityId
     * @return array|mixed
     * @throws Exception
     */
    public function getMinAndMaxPriceByCity($cityId)
    {
        try {
            return $this->sqlSelect([
                "MIN(minDailyRate) AS minDailyRate",
                "MAX(maxDailyRate) AS maxDailyRate"
            ], [["cityId", "=", $cityId]])->get(false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $userId
     * @param $rechargeValue
     * @param $price
     * @param $cardId
     * @return array|mixed
     * @throws Exception
     */
    public function rechargeBalance($userId, $rechargeValue, $price, $cardId)
    {
        try {
            $this->beginTransaction();

            $card = new Card((new CardDao)->find($cardId));
            $establishment = new Establishment($this->find($card->getEstablishmentId()));

            $transaction = new Transaction;
//            $transaction->cieloPayment($price, $card, $establishment);
            $transaction->credit($price, $card);

            (new TransactionDao)->sqlInsert($transaction);

            $recharge = new EstablishmentRecharge($transaction->toStdClass());
            $recharge->setBalance($rechargeValue);
            $recharge->setUserId($userId);
            $recharge->setEstablishmentId($establishment->getIdEstablishment());
            $recharge->setTransactionId($transaction->getIdTransaction());

            (new EstablishmentRechargeDao)->sqlInsert($recharge);

            (new BalanceDao)
                ->addBalanceByRecharge($establishment->getBalanceId(), $rechargeValue);

            $this->commit();

            return $this->find($establishment->getIdEstablishment(), ['idEstablishment', 'fantasyName', 'balanceId']);

        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    /**
     * @param $establishmentId
     * @return EstablishmentDao
     * @throws Exception
     */
    public function getBalance($establishmentId)
    {
        try {
            return $this->find($establishmentId, ['idEstablishment', 'balanceId'])->balance;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $establishmentId
     * @return array|mixed
     * @throws Exception
     */
    public function getCurrentTrips($establishmentId)
    {
        try {
            $trips = (new TripDao)->sqlSelect(
                [
                    'tripReference',
                    'status',
                    'establishmentId',
                    'stationId',
                    'destinationId',
                    'driverId',
                    'price',
                    'customerId'
                ], [
                ['establishmentId', '=', ':establishmentId', 'AND'],
                ['(status', '<>', ':statusCanceled', 'AND'],
                ['status', '<>', ':statusFinished' . ')']
            ])
                ->bind([
                    ':establishmentId' => $establishmentId,
                    ':statusCanceled' => Trip::CANCELED,
                    ':statusFinished' => Trip::FINISHED
                ])
                ->get();

            return array_map(function ($trip) {

                $trip->establishment = $this->find($trip->establishmentId, ['latitude', 'longitude']);

                $trip->destination = $this->findDestination(new Trip($trip));
                $trip->customer = (new CustomerDao)
                    ->find($trip->customerId);

                $trip = $this->mountDriverInTrip($trip);

                return $trip;
            }, $trips);

        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function getTrips($request)
    {
        try {
            $tripDao = new TripDao;
            $resultWhere = $this->service->getWhereForGetTrips($request);

            $count = $tripDao->sqlSelect(['COUNT(*) AS totalRows'], $resultWhere['where'])
                ->bind($resultWhere['bind'])
                ->get(false);

            $resultSql = $this->service->getSqlForGetTrips($count->totalRows, $resultWhere['where'], $request->page ?? null);

            $trips = $tripDao->sqlRawSelect($resultSql['sql'], $resultWhere['bind'])->get();

            return [
                "paginate" => $resultSql['paginationInfo'],
                "trips" => $trips
            ];

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $commercialEmail
     * @param $administratorEmail
     * @throws Exception
     */
    private function checkEstablishmentEmails($commercialEmail, $administratorEmail)
    {
        $commercialEmailExists = $this->sqlSelect([], [['commercialEmail', '=', ':commercialEmail']])
            ->bind([':commercialEmail' => $commercialEmail])
            ->get(false);

        if ($commercialEmailExists)
            throw new InvalidFieldEstablishmentException("Email comercial já existe!", 'commercialEmail');

        $administratorEmailExists = $this->sqlSelect([], [['administratorEmail', '=', ':administratorEmail']])
            ->bind([':administratorEmail' => $administratorEmail])
            ->get(false);

        if ($administratorEmailExists)
            throw new InvalidFieldEstablishmentException("Email do administrador já existe!", 'administratorEmail');
    }

    /**
     * @param $trip
     * @return mixed
     * @throws Exception
     */
    private function mountDriverInTrip($trip)
    {
        $trip->driver = $trip->driverId != null ?
            (new DriverDao)->find($trip->driverId) :
            null;

        if ($trip->status == Trip::ACCEPTED) {
            $trip->driver->estimative = (new DirectionService)->getDistance(
                $trip->driver->location->latitude,
                $trip->driver->location->longitude,
                $trip->establishment->latitude,
                $trip->establishment->longitude
            );
        }

        return $trip;
    }

    /**
     * @param \app\model\Trip $trip
     * @return array|mixed
     * @throws Exception
     */
    private function findDestination(Trip $trip)
    {
        if (!empty($trip->getStationId()))
            return (new StationDao)
                ->find($trip->getStationId(), ['name', 'latitude', 'longitude']);

        return (new DestinationDao)
            ->find($trip->getDestinationId(), ['address AS name', 'latitude', 'longitude']);
    }
}