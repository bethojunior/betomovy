<?php

namespace app\dao;

use app\exceptions\PartnerException;
use app\services\CheckDocumentService;
use app\services\CustomerPartnerService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\model\Customer;
use Exception;
use app\model\LevelAccess;
use app\model\Log;
use app\model\LogApp;
use app\model\LogCriticalType;
use app\model\LogType;
use app\model\Place;
use app\model\User;
use app\model\UserType;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/10/2018
 * Time: 15:28
 */
class CustomerPartnerDao extends BaseDao
{
    protected $table = "customer";
    private $service;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->service = new CustomerPartnerService;
        parent::__construct($conn, $sql);
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

            $count = $this->sqlRawSelect("
                SELECT COUNT(*) AS totalRows FROM trip t
                  INNER JOIN customer c ON c.userId = t.userId
                WHERE {$this->service->getWhereLikeString($resultWhere['where'])}
            ", $resultWhere['bind'])
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
     * Buscar informações da tabela de customer
     * @param $customerId
     * @param array $fields
     * @return array|mixed
     * @throws Exception
     */
    public function find($customerId, $fields = [])
    {
        try {
            return $this->sqlSelect($fields, [['idCustomer', '=', $customerId]])->get(false);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar cliente com informações de usuario
     * @param $customerId
     * @return array|mixed
     * @throws Exception
     */
    public function findWithUser($customerId)
    {
        $userTable = (new User)->getTableName();

        $sql = "SELECT
                  c.idCustomer,
                  u.idUser,
                  u.email,
                  u.name,
                  u.nickname,
                  u.phone,
                  c.balanceId,
                  c.placeId,
                  u.bankAccountId,
                  u.statusId
                FROM {$this->table} c
                  INNER JOIN {$userTable} u on c.userId = u.idUser
                WHERE c.idCustomer = :idCustomer
        ";

        $customer = $this->sqlRawSelect($sql, [':idCustomer' => $customerId])
            ->get(false);

        if (!$customer)
            throw new Exception("Cliente não encontrado");

        return $customer;
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    public function findByUser($userId)
    {
        $userTable = (new User)->getTableName();
        $placesTable = (new Place)->getTableName();

        $sql = "
            SELECT
              c.idCustomer,
              u.idUser,
              u.name AS nameUser,
              u.nickname,
              u.email,
              u.phone,
              u.document,
              p.idPlace,
              p.alias,
              p.address,
              p.number,
              p.cityId,
              p.latitude,
              p.longitude
            FROM {$this->table} c
              INNER JOIN {$userTable} u on c.userId = u.idUser
              LEFT JOIN {$placesTable} p on c.placeId = p.idPlace
            WHERE u.idUser = :idUser
        ";

        $customer = $this->sqlRawSelect($sql, [':idUser' => $userId])
            ->get(false);

        if (!$customer)
            throw new Exception("Parceiro não encontrado");

        return $customer;
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function editProfile($request)
    {
        $userDao = new UserDao;

        $editMounted = $this->service->mountEditProfile($request);

        $userDao->sqlUpdate($editMounted['set'], [$editMounted['where']], $editMounted['bind']);

        $partner = $this->findByUser($request->idUser);

        $this->createLog(
            $partner,
            $partner->idCustomer,
            $partner->idUser,
            'PARCEIRO ALTEROU SUAS INFORMAÇÕES'
        );

        return $partner;
    }

    /**
     * @param $email
     * @return array|mixed
     * @throws Exception
     */
    public function checkEmail($email)
    {
        $userTable = (new User)->getTableName();
        $levelAccess = (new LevelAccess)->getTableName();

        try {
            $sql = "
                SELECT
                    u.email
                FROM {$userTable} u
                  INNER JOIN {$levelAccess} la ON la.userId = u.idUser
                WHERE 
                  u.email = :email AND 
                  u.statusId = :statusId AND 
                  la.userTypeId = :userTypeId
            ";

            $user = $this->sqlRawSelect($sql, [
                ':email' => $email,
                ':statusId' => User::STATUS_ATIVO,
                ':userTypeId' => UserType::CLIENTE_FINAL_PARCEIRO,
            ])
                ->get(false);

            if (empty($user))
                throw new Exception("Usuário não encontrado: $email");

            return $user;

        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $document
     * @return array|mixed
     * @throws PartnerException
     */
    public function checkDocument($document)
    {
        $checkDocumentService = new CheckDocumentService;

        $resultSql = $checkDocumentService->sqlCheckDocument($document, UserType::CLIENTE_FINAL_PARCEIRO);

        $customer = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])
            ->get(false);

        if (!$customer)
            throw new PartnerException(300);

        return $customer;
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function insertPlace($request)
    {
        try {
            $customer = new Customer($this->find($request->customerId));

            $this->beginTransaction();

            $place = (new PlaceDao)->attachPlaceIntoCustomerPartner($customer, $request);

            $this->insertDefaultPlace($place, $customer);

            $this->commit();

        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }

        return $place->toStdClass();
    }

    /**
     * @param Place $place
     * @param Customer $customer
     * @return bool
     * @throws Exception
     */
    private function insertDefaultPlace(Place $place, Customer $customer): bool
    {
        return $this->sqlUpdate(
            ['placeId' => ':placeId'],
            [['idCustomer', '=', ':idCustomer']],
            [
                ':placeId' => $place->getIdPlace(),
                ':idCustomer' => $customer->getIdCustomer()
            ]
        );
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
    private function createLog($data, $idReference, $userId, $message, $level = LogCriticalType::INFORMACAO): bool
    {
        $log = new Log(LogType::PROCESS, $level);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::PWA)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}