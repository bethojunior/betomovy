<?php

namespace app\dao;

use app\constant\DriverConst;
use app\services\StationService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\validator\StationValidator;
use app\model\DriverStation;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Station;
use app\model\Status;
use stdClass;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 13/07/2018
 * Time: 10:28
 */
class StationDao extends BaseDao
{
    private $validator;
    private $service;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->validator = new StationValidator;
        $this->service = new StationService;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $cityId
     * @param null $stationTypeId
     * @return array|mixed
     * @throws Exception
     */
    public function getByCity($cityId, $stationTypeId = null)
    {
        $where = empty($stationTypeId) ?
            [['cityId', '=', $cityId]] :
            [['cityId', '=', $cityId, 'AND'], ['stationTypeId', '=', $stationTypeId]];
        try {
            return $this->sqlSelect(['idStation', 'name', 'cityId', 'latitude', 'longitude'], $where)->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idStation
     * @param array $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($idStation, $fields = [])
    {
        try {
            $station = $this->sqlSelect($fields, [['idStation', '=', $idStation]])->get(false);

            return $station;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $driverId
     * @return array|mixed
     */
    public function getByDriver($driverId)
    {
        $sql = "
            SELECT
              ds.stationId,
              st.name,
              st.stationTypeId,
              st.address,
              st.latitude,
              st.longitude
            FROM station st
              INNER JOIN driverStation ds on st.idStation = ds.stationId
              WHERE ds.driverId = :driverId AND ds.statusId = :statusId
        ";

        $stations = $this->sqlRawSelect($sql, [':driverId' => $driverId, ':statusId' => Status::ATIVO])
            ->get();

        return $stations;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function insertByDriver($request)
    {
        $this->validator->validateInsertStation($request);

        $existingStations = $this->getByDriver($request->driverId);

        if (count($existingStations) >= DriverConst::LIMIT_STATIONS)
            throw new Exception("Limite de returns do motorista atingido");

        $station = $this->createDriverStation($request, $request->driverId);
        $driver = (new DriverDao)
            ->find($request->driverId, false, false);

        $logData = (object)[
            'station' => $station->toStdClass(),
            'driver' => $driver
        ];

        $this->createDriverStationLog(
            $logData,
            $station->getIdStation(),
            $driver->userId,
            "MOTORISTA INSERIU UM NOVO RETURN"
        );

        return $station->toStdClass();
    }

    /**
     * @param $driverId
     * @param $stationId
     * @return bool
     * @throws Exception
     */
    public function deleteByDriver($driverId, $stationId): bool
    {
        $driverDao = new DriverDao;

        $driver = $driverDao->find($driverId, false, false);

        $existingStations = $this->getByDriver($driverId);

        if (count($existingStations) <= DriverConst::MIN_STATIONS)
            throw new Exception("Motorista deve ter pelo menos um posto registrado");

        (new DriverStationDao)
            ->delete($driverId, $stationId);

        $existingStations = $this->getByDriver($driverId);

        if ($driver->stationId == $stationId)
            $driverDao->updateDefaultStation($driverId, $existingStations[0]->stationId);

        return true;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function edit($request)
    {
        $this->validator->validateUpdateStation($request);

        $station = new Station($this->find($request->idStation));
        $station
            ->setName($request->name ?? $station->getName())
            ->setStationTypeId($request->stationTypeId ?? $station->getStationTypeId())
            ->setLatitude($request->latitude ?? $station->getLatitude())
            ->setLongitude($request->longitude ?? $station->getLongitude())
            ->setAddress($request->address ?? $station->getAddress());

        $resultSql = $this->service->mountSqlToUpdateStation($station);
        $this->sqlRawUpdate($resultSql['sql'], $resultSql['bind']);

        return $station->toStdClass();
    }

    /**
     * @param $data
     * @param $driverId
     * @return Station
     * @throws Exception
     */
    private function createDriverStation($data, $driverId): Station
    {
        $station = new Station($data);
        $station->setIdStation(
            $this->sqlInsert($station)
        );

        $driverStation = new DriverStation;
        $driverStation
            ->setDriverId($driverId)
            ->setStationId($station->getIdStation());

        (new DriverStationDao)->sqlInsert($driverStation);

        return $station;
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @param string $level
     * @return bool
     * @throws Exception
     */
    private function createDriverStationLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}