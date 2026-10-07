<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\TripHistory;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 26/07/2018
 * Time: 09:29
 */
class TripHistoryDao extends BaseDao
{
    protected $table = "tripHistory";

    /**
     * @param $tripReference
     * @return array|mixed
     * @throws Exception
     */
    public function getByTrip($tripReference)
    {
        $sql = "
            SELECT
              t.idTripHistory,
              t.driverId,
              t.tripReference,
              t.date,
              t.status,
              t.countDenied,
              u.deviceToken
            FROM {$this->table} t
              INNER JOIN driver d ON t.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE t.tripReference = :tripReference;
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $tripReference
     * @param null $driverId
     * @return array|mixed
     * @throws Exception
     */
    public function findByTrip($tripReference, $driverId = null)
    {
        try {
            $where = empty($driverId) ?
                [['tripReference', '=', "'{$tripReference}'"]] :
                [['tripReference', '=', "'{$tripReference}'", 'AND'], ['driverId', '=', $driverId]];

            return $this->sqlSelect([], $where)->get(false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $trips
     * @param null $driverId
     * @throws Exception
     */
    public function insertTripsFound($trips, $driverId = null)
    {
        if (!empty($trips)) {
            foreach ($trips as $trip) {
                $tripRef = method_exists($trip, 'getTripReference') 
                    ? $trip->getTripReference() 
                    : $trip->tripReference;
                    
                $history = $this->findByTrip($tripRef, $driverId);
                if (empty($history)) {
                    $tripHistory = new TripHistory();
                    $tripHistory->setDriverId($driverId);
                    $tripHistory->setTripReference($tripRef);
                    $tripHistory->setDate(now());

                    if ($driverId) {
                        $driverBalance = $this->getDriverBalance($driverId);
                        if ($driverBalance !== null) {
                            $tripHistory->setDriverBalanceInStartCall($driverBalance);
                        }
                    }

                    $this->sqlInsert($tripHistory);
                }
            }
        }
    }

    /**
     * Busca o saldo atual do motorista
     * @param int $driverId
     * @return float|null
     */
    private function getDriverBalance($driverId)
    {
        try {
            $driverDao = new DriverDao();
            $driver = $driverDao->find($driverId, true, false);

            if ($driver && isset($driver->balanceId) && $driver->balanceId) {
                $balanceDao = new BalanceDao();
                $balance = $balanceDao->find($driver->balanceId);

                if ($balance && isset($balance->balance)) {
                    return (float) $balance->balance;
                }
            }

            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * @param $drivers
     * @param $tripReference
     * @throws Exception
     */
    public function insertDriversFound($drivers, $tripReference)
    {
        try {
            if (!empty($drivers)) {
                foreach ($drivers as $driver) {
                    $history = $this->findByTrip($tripReference, $driver->idDriver);
                    if (empty($history)) {
                        $tripHistory = new TripHistory();
                        $tripHistory->setDriverId($driver->idDriver);
                        $tripHistory->setTripReference($tripReference);
                        $tripHistory->setDate(now());

                        $this->sqlInsert($tripHistory);
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function changeStatus($tripReference, $driverId, $status)
    {
        try {
            if ($status == TripHistory::DENIED) {
                $tripHistory = $this->findByTrip($tripReference, $driverId);

                return $this->sqlUpdate(
                    ['status' => "'" . $status . "'", 'countDenied' => $tripHistory->countDenied + 1],
                    [['tripReference', '=', "'{$tripReference}'", 'AND'], ['driverId', '=', $driverId]]
                );
            }

            return $this->sqlUpdate(['status' => "'" . $status . "'"],
                [['tripReference', '=', "'{$tripReference}'", 'AND'], ['driverId', '=', $driverId]]);
        } catch (Exception $e) {
            throw $e;
        }
    }
}