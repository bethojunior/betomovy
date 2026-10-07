<?php

namespace app\dao;

use app\services\CityCallConfigService;
use app\utils\BaseDao;
use app\model\Config;
use app\model\ConfigType;
use app\model\Origin;
use app\model\Trip;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 20:25
 */

class DriversCloseTheTripDao extends BaseDao
{
    protected $table = "drivers_close_the_trip_view";

    private $cityCallConfigService;
    private $cityConfigDao;
    private $callGroupsTripTypeLinked;

    public function __construct()
    {
        $this->cityCallConfigService = new CityCallConfigService;
        $this->cityConfigDao = new CityConfigDao;
        $this->callGroupsTripTypeLinked = new CallGroupsTripTypeLinkedDao;
        parent::__construct();
    }

   private function orderListCalledDriverByGroup(array $listDrivers, int $tripTypeId)
   {
        $listCallGroups = $this->callGroupsTripTypeLinked->getCallsGroupsTripTypeLinked($tripTypeId);
        
        if(empty($listCallGroups)) {
            return $listDrivers;
        }
        
        $listDriversNotGroup = [];

        // Inicializa a lista de motoristas dentro de cada grupo
        foreach ($listCallGroups as $callGroup) {
            $callGroup->drivers = [];
        }
        
        // Separa por grupos ou sem grupo
        foreach ($listDrivers as $driver) {

            if (empty($driver->call_group_ids)) {
                $listDriversNotGroup[] = $driver;
                continue;
            }

            $ids = explode(",", $driver->call_group_ids);
            $added = false;

            foreach ($listCallGroups as $callGroup) {
                if (in_array($callGroup->id, $ids)) {
                    $callGroup->drivers[] = $driver;
                    $added = true;
                }
            }

            if (!$added) {
                $listDriversNotGroup[] = $driver;
            }
        }

        // Ordena os grupos pelo menor weight
        usort($listCallGroups, function ($a, $b) {
            $weightsA = array_map('intval', explode(',', $a->weight ?? 0));
            $weightsB = array_map('intval', explode(',', $b->weight ?? 0));
            return min($weightsA) <=> min($weightsB);
        });

        // Concatena: primeiro os drivers ordenados pelos grupos
        $listDriversOrdered = [];

        foreach ($listCallGroups as $callGroup) {
            foreach ($callGroup->drivers as $driver) {
                $listDriversOrdered[] = $driver;
            }
        }

        // Depois os sem grupo
        foreach ($listDriversNotGroup as $driver) {
            $listDriversOrdered[] = $driver;
        }

        return $listDriversOrdered;
    }

    //@TODO: FUNÇÃO QUE ORDENA OS GRUPOS DE CHAMADOS COM SEUS MOTORISTAS - FUNÇÃO CRIADA PARA UMA FUTURA MELHORIA NO FLUXO.
    // private function orderListCalledDriverByCallGroup(array $listDrivers, int $tripTypeId)
    // {
        // $listCallGroups = $this->callGroupsTripTypeLinked
            // ->getCallsGroupsTripTypeLinked($tripTypeId);

        // if (empty($listCallGroups)) {
           // return [
                // 'no_group' => [
                    // 'drivers' => $listDrivers
                // ]
            // ];
        // }

        // $groups = [];

        // foreach ($listCallGroups as $group) {
            // $groups[$group->call_group_id] = [
                // 'call_group_id' => (int) $group->call_group_id,
                // 'name'          => $group->name,
                // 'weight'        => (int) $group->weight,
                // 'drivers'       => []
            // ];
        // }

        // $groups['no_group'] = [
            // 'call_group_id' => null,
            // 'name'          => 'Sem grupo',
            // 'weight'        => PHP_INT_MAX,
            // 'drivers'       => []
        // ];

        // foreach ($listDrivers as $driver) {

            // if (empty($driver->call_group_ids)) {
                // $groups['no_group']['drivers'][$driver->idDriver] = $driver;
                // continue;
            // }

            // $groupIds = array_map('intval', explode(',', $driver->call_group_ids));
            // $added = false;

            // foreach ($groupIds as $groupId) {
                // if (isset($groups[$groupId])) {
                    // $groups[$groupId]['drivers'][$driver->idDriver] = $driver;
                    // $added = true;
                // }
            // }

            // if (!$added) {
                // $groups['no_group']['drivers'][$driver->idDriver] = $driver;
            // }
        // }

        // uasort($groups, function ($a, $b) {
            // return $a['weight'] <=> $b['weight'];
        // });

        // foreach ($groups as &$group) {
            // $group['drivers'] = array_values($group['drivers']);
        // }

        // return $groups;
    // }

    /**
     * @param Trip $trip
     * @param \app\model\Origin $origin
     * @param bool $greaterRadius
     * @return array|mixed
     */
    public function findDriversCloseByRule(Trip $trip, Origin $origin, bool $greaterRadius = false)
    {
        $tripReference = $trip->getTripReference();

        $config = $this->cityConfigDao
            ->getByCoordinate($origin->getLatitude(), $origin->getLongitude());

        if (isset($config) && $config->quantityDriversCloseOnCall && $config->quantityDriversCloseOnCall > 0) {
            $driversResponse = $this->findDriversClose($trip, (int)$config->quantityDriversCloseOnCall, $greaterRadius);
            $driverOrderedResponse = $this->orderListCalledDriverByGroup($driversResponse, $trip->getTripTypeId());

            return $driverOrderedResponse;
        }

        $sql = "SELECT * FROM (";
        $bind = [];
        $offsets = [];

        $configs = $this->cityCallConfigService
            ->findAll($trip->getCityId(), $origin);

        foreach ($configs as $key => $config) {

            $offsets[$config->userTypeId] =
                isset($offsets[$config->userTypeId]) ?
                    $offsets[$config->userTypeId] + 1 :
                    0;

            if ($configs[0] != $config)
                $sql .= "UNION ";

            $result = $this->mountSql(
                $config->userTypeId,
                $offsets[$config->userTypeId],
                $config->userTypeId != UserType::MOTORISTA_RETURN ?: false,
                $key
            );

            $sql .= $result['sql'];

            foreach ($result['bind'] as $bindKey => $value) {
                $bind[$bindKey] = $value;
            }
        }

        $bind[':tripReference'] = $tripReference;

        $sql .= ") as t 
            ORDER BY isFav DESC, seq ASC
        ";

        $drivers = $this->sqlRawSelect($sql, $bind)
            ->get();

        return $drivers;
    }

    public function findDriversClose(Trip $trip, $limit = null, $greaterRadius = true)
    {
        $zone = (new ZoneDao)->find($trip->getZoneId());
        $greaterRadius = $greaterRadius ? 'greaterRadius' : 'radius';
        $sql = "
            SELECT
                IF(FIND_IN_SET(idDriver, favoriteDrivers) > 0, 1, 0) AS isFav,
                tripReference,
                idDriver,
                proximity,
                destinationProximity,
                radius,
                greaterRadius,
                tripTypeId,
                rating,
                driverType,
                favoriteDrivers,
                ((rating / 2) - ((proximity / 2) + (destinationProximity / 10))) AS returnValue,
                ((rating / 2) - (proximity / 10)) AS proximityValue,
                status,
                preAvailable,
                appIsOpen,
                dct.name,
                nickname,
                type,
                profileImage,
                deviceToken,
                dlcg.call_group_id AS call_group_ids
            FROM drivers_close_the_trip_view dct
            LEFT JOIN driversLinkedCallGroup dlcg ON dlcg.driverId = dct.idDriver
            WHERE
                tripReference = :tripReference
                AND idDriver NOT IN (
                    SELECT hwd.driverId 
                    FROM hours_worked_driver hwd
                    INNER JOIN limit_hours_worked lhw 
                        ON hwd.driverId = lhw.driverId
                    WHERE DATE(hwd.date) = CURDATE()
                    AND hwd.hours >= lhw.hours
                    AND hwd.hours > 0
                    AND lhw.hours > 0
                )
            HAVING destinationProximity <= :radiusReturn AND proximity <= {$greaterRadius}
            ORDER BY
                isFav DESC,
                proximity,
                CASE
                    WHEN destinationProximity != 0 THEN
                        destinationProximity
                    ELSE
                    {$greaterRadius}
                END,
                preAvailable
        ";
        
        if ($limit && is_int($limit) && $limit > 0)
            $sql .= " LIMIT {$limit}";
            
        $bind = [
            ':tripReference' => $trip->getTripReference(),
            ':radiusReturn' => $zone->radiusReturn
        ];
        
        $drivers = $this->sqlRawSelect($sql, $bind)->get();
        return $drivers;
    }

    public function getDriverWhoNotCantBeCalled()
    {
        $sql = "
            SELECT hwd.driverId 
            FROM hours_worked_driver hwd
            INNER JOIN limit_hours_worked lhw ON hwd.driverId = lhw.driverId
            WHERE DATE(hwd.date) = CURDATE()
            AND hwd.hours > lhw.hours";
        
        return $this->sqlRawSelect($sql)->get();
    }

    private function getLimitConfigs()
    {
        $limits = Config::get('limit_drivers_called_in_trip', ConfigType::TRIP);

        return json_decode($limits);
    }

    private function mountSql($userType, $offset, $returnOption = 1, $key = 0)
    {
        $sql = "
            (SELECT
                ({$key}+1) AS seq,
                IF(FIND_IN_SET(idDriver, favoriteDrivers) > 0, 1, 0) AS isFav,
                tripReference,
                idDriver,
                proximity,
                destinationProximity,
                radius,
                tripTypeId,
                rating,
                driverType,
                favoriteDrivers,
                ((rating / 2) - ((proximity / 2) + (destinationProximity / 10))) AS returnValue,
                ((rating / 2) - (proximity / 10)) AS proximityValue,
                status,
                preAvailable,
                appIsOpen,
                deviceToken
            FROM drivers_close_the_trip_view dct
            WHERE
                tripReference = :tripReference AND
                driverType = :userType{$key}
            HAVING ";

        $sql .= $this->sqlHavingOptions($returnOption, $offset);

        $sql .= ") ";

        $bind = [
            ":userType{$key}" => $userType,
        ];

        return [
            'sql' => $sql,
            'bind' => $bind,
        ];
    }

    private function sqlHavingOptions($returnOption = 1, $offset = 0)
    {
        if ($returnOption)
            return "
                CASE
                    WHEN tripTypeId = 1 AND isFav = 0 THEN
                        destinationProximity < radius AND proximity < radius
                    ELSE
                        proximity < radius
                END
                order by
                    isFav DESC,
                    CASE
                        WHEN tripTypeId = 1 THEN
                            destinationProximity
                        ELSE
                            proximity
                    END ASC,
                    proximity,
                    preAvailable ASC
                        LIMIT {$offset}, 1
            ";

        return "
            proximity < radius
                ORDER BY 
                    isFav DESC, 
                    proximity ASC, 
                    preAvailable ASC
                LIMIT {$offset}, 1
        ";
    }
}