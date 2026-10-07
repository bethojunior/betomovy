<?php

namespace app\dao;

use app\model\AdminNotification;
use app\constant\AdminNotificationTypeConst;
use app\constant\UserGroupConst;
use app\utils\BaseDao;
use app\model\Car;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 09/09/2018
 * Time: 10:03
 */
class CarDao extends BaseDao
{
    public function insert($data)
    {
        /** @var Car $car */
        $car = $this->create($data);

        return $car->toStdClass();
    }

    /**
     * @param $data
     * @return stdClass
     * @throws Exception
     */
    public function insertSecondCar($data)
    {
        $carPending = $this->sqlSelect([], [['driverId', '=', $data->driverId, ' AND '], ['pending', '=', '1']])->get(false);

        if (!empty($carPending)) throw new Exception("O motorista já está com um carro pendente");

        $document = $data->document ?? null;
        unset($data->document);

        $data->pending = 1;

        /** @var Car $car */
        $car = $this->create($data);

        $driver = (new DriverDao())->find($data->driverId);

        if ($document) {
            $car->setDocument($document, $driver->userId);

            $this->sqlUpdate(
                ['document' => ':document'],
                [['idCar', '=', ':idCar']],
                [':document' => $car->getDocument(), ':idCar' => $car->getIdCar()]
            );
        }

        $adminNotificationType =
            (new AdminNotificationTypeDao)->find(AdminNotificationTypeConst::VEHICLE_CHANGE_REQUEST);

        $adminNotification = new AdminNotification;
        $adminNotification
            ->setUserId($driver->userId)
            ->setAdminNotificationTypeId(AdminNotificationTypeConst::VEHICLE_CHANGE_REQUEST)
            ->setUserGroupId(UserGroupConst::DRIVER)
            ->setMessage(str_replace('{userName}', $driver->name, $adminNotificationType->defaultMessage))
            ->setTitle($adminNotificationType->name)
            ->setCityId($driver->cityId ?? null)
            ->setId(
                (new AdminNotificationDao)
                    ->sqlInsert($adminNotification));

        return $car->toStdClass();
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function getCarByDriver($driverId)
    {
        $sql = "
            SELECT *
            FROM car
            WHERE driverId = :driverId
              AND deleted_at IS NULL
              AND (pending IS NULL
                OR pending <> 1)
        ";

        $bind = [':driverId' => $driverId];
        $car = $this->sqlRawSelect($sql, $bind)->get(false);
        if (!$car)
            throw new Exception("Carro não encontrado");
        return $car;
    }

    /**
     * @param $driverId
     * @return array|mixed
     */
    public function getByDriverForTrip($driverId)
    {
//        $car = $this->sqlSelect(
//            ['plate', 'year', 'model', 'color', 'brand'],
//            [['driverId', '=', ':driverId']]
//        )
//            ->bind([':driverId' => $driverId])
//            ->get(false);
//
//        return $car;

        $sql = "
            SELECT plate, 
                   year,
                   model,
                   color,
                   brand, 
                   renavam
            FROM car
            WHERE driverId = :driverId
              AND deleted_at IS NULL
              AND (pending IS NULL
                OR pending <> 1)
            LIMIT 1;
        ";
        $bind = [':driverId' => $driverId];
        $car = $this->sqlRawSelect($sql, $bind)->get(false);

        return $car;
    }

    public function getByUser($userId)
    {
        $sql = "
            SELECT
                c.*
            FROM {$this->table} c
              INNER JOIN driver d ON c.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE u.idUser = :userId
              LIMIT 1
        ";

        $bind = [':userId' => $userId];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function getAll()
    {
        return $this->sqlSelect()
            ->get();
    }

    public function findAllPendingByDriver($driverId)
    {
        $sql = "
            SELECT *
            FROM car
            WHERE driverId = :driverId
              AND pending = 1;
        ";

        $bind = [':driverId' => $driverId];
        $car = $this->sqlRawSelect($sql, $bind)->get(false);
        if (!$car)
            throw new Exception("Carro não encontrado");
        return $car;
    }
}