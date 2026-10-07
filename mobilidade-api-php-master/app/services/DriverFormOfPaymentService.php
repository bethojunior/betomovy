<?php

namespace app\services;

use app\dao\DriverDao;
use app\dao\DriverFormOfPaymentDao;
use app\dao\DriverFormOfPaymentImpositionDao;
use app\utils\Connection;
use app\model\DriverFormOfPayment;
use Exception;
use PDO;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 10:57
 */
class DriverFormOfPaymentService
{
    private $dao;
    /**
     * @var \MongoDB\Driver\Manager|PDO|null
     */
    private $conn;
    private $driverFormOfPaymentImpositionDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new DriverFormOfPaymentDao;
        $this->driverFormOfPaymentImpositionDao = new DriverFormOfPaymentImpositionDao;
    }

    /**
     * @param stdClass $request
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function insert(?stdClass $request, int $userId): array
    {
        if (!isset($request->tripPaymentForms) || !is_array($request->tripPaymentForms))
            throw new Exception("Formas de pagamentos inválidas");

        $driver = (new DriverDao)->findByUserId($userId, false);

        $this->conn->beginTransaction();

        $this->dao->deleteAllByDriver($driver->idDriver);

        try {
            $formsOfPayment = array_map(function ($tripPaymentFormId) use ($driver) {

                $driverFormOfPayment = new DriverFormOfPayment();
                $driverFormOfPayment
                    ->setDriverId($driver->idDriver)
                    ->setTripPaymentFormId($tripPaymentFormId)
                    ->setId($this->dao->sqlInsert($driverFormOfPayment));

                return $driverFormOfPayment->toStdClass();
            }, $request->tripPaymentForms);

            $this->conn->commit();
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            throw $e;
        }

        return $formsOfPayment;
    }

    public function findAll(int $userId): array
    {
        $driver =
            (new DriverDao)->findByUserId($userId, false);

        return $this->dao
            ->findByDriver($driver->idDriver);
    }

    public function delete(stdClass $request)
    {
        if (!isset($request->driverFormOfPaymentId) || !is_int($request->driverFormOfPaymentId))
            throw new Exception("Forma de pagamento inválida");

        return $this->dao
            ->delete($request->driverFormOfPaymentId);
    }

    public function findAllImposition(int $userId)
    {
        $driver =
            (new DriverDao)->findByUserId($userId, false);

        return $this->driverFormOfPaymentImpositionDao->findByDriver($driver->idDriver);
    }
}