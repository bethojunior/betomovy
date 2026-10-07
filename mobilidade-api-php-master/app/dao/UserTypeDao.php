<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Status;
use app\model\UserTypeLinkedAppPartner;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:45
 */
class UserTypeDao extends BaseDao
{
    protected $table = "userType";

    /**
     * @return array|mixed
     * @throws Exception
     */
    public function getAll()
    {
        try {
            return $this->sqlSelect()->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function find(int $id)
    {
        return $this->sqlSelect(
            [],
            [
                ['idUserType', '=', ':idUserType']
            ])
            ->bind([
                ':idUserType' => $id,
            ])
            ->first();
    }

    public function getMessageTripCanceled($tripReference)
    {
        $result = $this->sqlRawSelect("
            SELECT ut.cancellationText
            FROM userType ut
            JOIN levelAccess la ON la.userTypeId = ut.idUserType
            JOIN user u ON u.idUser = la.userId
            JOIN driver d ON d.userId = u.idUser
            JOIN trip t ON t.driverId = d.idDriver
            WHERE t.tripReference = :tripReference
            ORDER BY t.idTrip DESC
            LIMIT 1
        ", ['tripReference' => $tripReference])->get();

        return $result[0] ?? (object)[];
    }
    
    /**
     * @return array|mixed
     */
    public function getTypeDrivers()
    {
        $userTypeLinkedAppPartnerTable = (new UserTypeLinkedAppPartner())->getTableName();

        $SQL = "
            SELECT  
                userType.*
            FROM {$this->table} AS userType
            LEFT JOIN {$userTypeLinkedAppPartnerTable} AS userTypeLinkedAppPartner 
                ON userType.idUserType = userTypeLinkedAppPartner.userTypeId
            WHERE userTypeLinkedAppPartner.userTypeId IS NULL
            AND userType.isActive = :isActive
            AND userType.statusId = :statusId
            AND (userType.isDriver = :idDriver 
                OR userType.isDeliveryMan = :isDeliveryMan)
        ";

        $bindSQL = [
            ':idDriver' => true,
            ':isDeliveryMan' => true,
            ':isActive' => true,
            ':statusId' => Status::ATIVO
        ];

        return $this->sqlRawSelect($SQL, $bindSQL)->get();
    }

    public function getIdsTypeDriver()
    {
        $result = $this->sqlRawSelect("select idUserType
            from userType
            where isDriver = true
              and statusId = :statusId",
            [":statusId" => Status::ATIVO])->get();

        return array_map(function ($item) {
            return $item->idUserType;
        }, $result);
    }

    /**
     * Tipos de passageiro/cliente ativos no banco do tenant (sem hardcode de id).
     *
     * @return int[]
     */
    public function getIdsTypeCustomer(): array
    {
        $result = $this->sqlRawSelect("
            SELECT idUserType
            FROM userType
            WHERE statusId = :statusId
              AND isActive = true
              AND (isDriver = false OR isDriver IS NULL)
              AND (isDeliveryMan = false OR isDeliveryMan IS NULL)
              AND (
                UPPER(name) LIKE '%CLIENTE%'
                OR UPPER(name) LIKE '%PASSAGEIRO%'
              )
        ", [':statusId' => Status::ATIVO])->get();

        $ids = array_map(static function ($item) {
            return (int) $item->idUserType;
        }, $result);

        if (!empty($ids)) {
            return $ids;
        }

        $usedInCustomerTable = $this->sqlRawSelect("
            SELECT DISTINCT la.userTypeId AS idUserType
            FROM customer c
            INNER JOIN user u ON u.idUser = c.userId
            INNER JOIN levelAccess la ON la.userId = u.idUser
            WHERE u.statusId = :statusId
        ", [':statusId' => Status::ATIVO])->get();

        return array_map(static function ($item) {
            return (int) $item->idUserType;
        }, $usedInCustomerTable);
    }

    public function getDriversByAppPartner($keyAppPartner)
    {
        $userTypeLinkedAppPartnerTable = (new \app\model\UserTypeLinkedAppPartner())->getTableName();
        $configAppPartnerTable = (new \app\model\ConfigAppPartner())->getTableName();

        $SQL = "
            SELECT  
                userType.*,
                userTypeLinkedAppPartner.*,
                configAppPartner.*
            FROM {$this->table} AS userType
            INNER JOIN {$userTypeLinkedAppPartnerTable} AS userTypeLinkedAppPartner 
                ON userType.idUserType = userTypeLinkedAppPartner.userTypeId
            INNER JOIN {$configAppPartnerTable} AS configAppPartner
                ON userTypeLinkedAppPartner.config_apps_partners_id = configAppPartner.id
            WHERE configAppPartner.key = :keyAppPartner
            AND userType.isActive = :isActive
            AND userType.statusId = :statusId
            AND (userType.isDriver = :idDriver OR userType.isDeliveryMan = :isDeliveryMan);
            ";

        $bindSSQL = [
            ':keyAppPartner' => $keyAppPartner,
            ':idDriver' => true,
            ':isDeliveryMan' => true,
            ':isActive' => true,
            ':statusId' => Status::ATIVO
        ];


        return $this->sqlRawSelect($SQL, $bindSSQL)->get();
    }
}
