<?php

namespace app\dao;

use app\constant\EstablishmentConst;
use app\services\CheckDocumentService;
use app\utils\BaseDao;
use app\utils\FormatValue;
use app\utils\TokenApi;
use app\model\Employee;
use app\model\Establishment;
use Exception;
use app\model\LevelAccess;
use app\model\Location;
use app\model\Log;
use app\model\LogApp;
use app\model\LogType;
use app\model\Status;
use app\model\User;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:45
 */
class UserDao extends BaseDao
{
    /**
     * @param User $user
     * @return array|mixed
     * @throws Exception
     */
    public function authenticate(User $user)
    {
        $employeeTable = (new Employee)->getTableName();
        $establishmentTable = (new Establishment)->getTableName();
        $levelAccessTable = (new LevelAccess)->getTableName();

        $ativo = User::STATUS_ATIVO;

        try {
            $authenticate = $this->sqlRawSelect("SELECT 
              {$this->table}.idUser,
              {$this->table}.name AS nameUser,
              {$this->table}.nickname,
              {$this->table}.document,
              {$this->table}.phone,
              {$this->table}.email,
              {$employeeTable}.occupation,
              {$employeeTable}.commission,
              {$establishmentTable}.idEstablishment,
              {$establishmentTable}.establishmentStatusId,
              {$establishmentTable}.fantasyName,
              {$establishmentTable}.address,
              {$establishmentTable}.zipcode,
              {$establishmentTable}.latitude,
              {$establishmentTable}.longitude,
              {$establishmentTable}.photos,
              {$establishmentTable}.cityId,
              {$levelAccessTable}.userTypeId
              FROM {$this->table} 
              INNER JOIN {$employeeTable} ON {$employeeTable}.userId = {$this->table}.idUser
              INNER JOIN {$establishmentTable} ON {$establishmentTable}.idEstablishment = {$employeeTable}.establishmentId
              INNER JOIN {$levelAccessTable} ON {$levelAccessTable}.userId = {$this->table}.idUser
              WHERE
                  email = :email AND
                  password = :password AND
                  (userTypeId <> :driverType AND userTypeId <> :adminType) AND
                  {$this->table}.statusId = :statusId LIMIT 1
            ", [
                ":email" => $user->getEmail(),
                ":password" => $user->getPassword(),
                ":statusId" => $ativo,
                ":driverType" => UserType::MOTORISTA,
                ":adminType" => UserType::ADMINISTRADOR
            ])->get(false);

            $this->checkAuthenticate($authenticate);

            $log = new Log(LogType::PROCESS);
            $log->setData($authenticate)
                ->setIdReference($authenticate->idUser)
                ->setUserId($authenticate->idUser)
                ->setApp(LogApp::PWA)
                ->setMessage("Login Efetuado");

            (new LogDao)->insert($log);

            return $authenticate;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param string $email
     * @return array|mixed
     */
    public function getByEmail(string $email)
    {
        return $this->sqlSelect(['email'], [
            ['email', '=', ':email', 'AND'],
            ['statusId', '=', ':statusId']
        ], [], 1)
            ->bind([':email' => $email, ':statusId' => User::STATUS_ATIVO])
            ->get(false);
    }

    /**
     * @param $idUser
     * @param array $fields
     * @return array|mixed
     */
    public function find($idUser, $fields = [])
    {
        return $this->sqlSelect($fields, [
            ['idUser', '=', ':idUser', 'AND'],
            ['statusId', '=', ':statusId']
        ])
            ->bind([':idUser' => $idUser, ':statusId' => User::STATUS_ATIVO])
            ->get(false);
    }

    public function findWithBalance($userId)
    {
        $sql = "
            SELECT
                u.*,
                IFNULL(c.balanceId, d.balanceId) AS balanceId
            FROM {$this->table} u
              LEFT JOIN driver d ON d.userId = u.idUser
              LEFT JOIN customer c ON c.userId = u.idUser
            WHERE
              u.idUser = :idUser
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql, [
            ':idUser' => $userId
        ])
            ->get(false);
    }

    public function findWithLocation(int $userId)
    {
        $sql = /** @lang sql */ "
            SELECT
                u.idUser,
                u.name,
                u.email,
                IFNULL(d.last_lat, u.last_lat) AS last_lat,
                IFNULL(d.last_lon, u.last_lon) AS last_lon
            FROM user u
              LEFT JOIN driver d ON d.userId = u.idUser
            WHERE
              u.idUser = :idUser
            LIMIT 1
        ";

        return $this->sqlRawSelect($sql, [
            ':idUser' => $userId
        ])
            ->get(false);
    }

    /**
     * @param array $set
     * @param $idUser
     * @return bool
     * @throws Exception
     */
    public function update(array $set, $idUser)
    {
        $bind = [':idUser' => $idUser];
        $newSet = [];

        foreach ($set as $key => $value) {
            $bind += [":{$key}" => $value];
            $newSet += [$key => ":{$key}"];
        }

        return $this->sqlUpdate(
            $newSet, [['idUser', '=', ':idUser']], $bind);
    }

    /**
     * @param $email
     * @return array|mixed
     * @throws Exception
     */
    public function checkEmail($email)
    {
        $levelAccessTable = (new LevelAccess)->getTableName();
        
        try {
            $sql = "
                SELECT
                    u.email
                FROM {$this->table} u
                  INNER JOIN {$levelAccessTable} la ON u.idUser = la.userId
                WHERE 
                  u.email = :email AND 
                  u.statusId = :statusId AND
                  la.userTypeId = :userTypeId
            ";

            $user = $this->sqlRawSelect($sql, [
                ':email' => $email,
                ':statusId' => User::STATUS_ATIVO,
                ':userTypeId' => UserType::CLIENTE_FINAL
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
     * @param $phone
     * @param int[]|null $userTypeIds
     * @return array|mixed
     * @throws Exception
     */
    public function checkPhone($phone, ?array $userTypeIds = null)
    {
        try {
            $user = $this->findActiveUserByPhone($phone, $userTypeIds);

            if (!$user)
                throw new Exception("Phone não encontrado: $phone");

            return $user;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $document
     * @param int[]|null $userTypeIds
     * @return array|mixed
     * @throws Exception
     */
    public function checkDocument($document, ?array $userTypeIds = null)
    {
        try {
            $user = $this->findActiveUserByDocument($document, $userTypeIds);

            if (!$user)
                throw new Exception("Documento não encontrado: $document");

            return $user;
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param int[] $userTypeIds
     */
    public function existsActivePhoneForUserTypes($phone, array $userTypeIds, $ignorePhone = null)
    {
        return (bool) $this->findActiveUserByPhone($phone, $userTypeIds, $ignorePhone);
    }

    /**
     * @param int[] $userTypeIds
     */
    public function existsActiveDocumentForUserTypes($document, array $userTypeIds, $ignoreDocument = null)
    {
        return (bool) $this->findActiveUserByDocument($document, $userTypeIds, $ignoreDocument);
    }

    /**
     * @param int[]|null $userTypeIds
     */
    public function findActiveUserByPhone($phone, ?array $userTypeIds = null, $ignorePhone = null)
    {
        $levelAccessTable = (new LevelAccess)->getTableName();
        $clearedPhone = FormatValue::formatPhoneClear((string) $phone);

        if (empty($clearedPhone) || strlen($clearedPhone) < 5) {
            return null;
        }

        $sql = "
            SELECT
                u.phone,
                u.email
            FROM {$this->table} u
        ";

        $bind = [
            ':phone' => $clearedPhone,
            ':statusId' => User::STATUS_ATIVO,
        ];

        if ($userTypeIds !== null && $userTypeIds !== []) {
            $placeholders = implode(',', array_map('intval', $userTypeIds));
            $sql .= "
              INNER JOIN {$levelAccessTable} la ON u.idUser = la.userId
            WHERE
              clearPhone(u.phone) = :phone AND
              u.statusId = :statusId AND
              la.userTypeId IN ({$placeholders})
            ";
        } else {
            $sql .= "
            WHERE
              clearPhone(u.phone) = :phone AND
              u.statusId = :statusId
            ";
        }

        if ($ignorePhone) {
            $sql .= " AND clearPhone(u.phone) NOT LIKE :ignore";
            $bind[':ignore'] = FormatValue::formatPhoneClear($ignorePhone);
        }

        $sql .= " LIMIT 1";

        return $this->sqlRawSelect($sql, $bind)->get(false) ?: null;
    }

    /**
     * @param int[]|null $userTypeIds
     */
    public function findActiveUserByDocument($document, ?array $userTypeIds = null, $ignoreDocument = null)
    {
        if ($userTypeIds === null || $userTypeIds === []) {
            $user = $this->sqlSelect(['document', 'email'], [
                ['document', '=', sqlString($document), 'AND'],
                ['statusId', '=', User::STATUS_ATIVO],
            ], [], 1)->get(false);

            return $user ?: null;
        }

        $checkDocumentService = new CheckDocumentService;
        $userTypeIdList = implode(',', array_map('intval', $userTypeIds));
        $resultSql = $checkDocumentService->sqlCheckDocument($document, $userTypeIdList, $ignoreDocument);

        $user = $this->sqlRawSelect($resultSql['sql'], $resultSql['bind'])->get(false);

        return $user ?: null;
    }

    /**
     * @param $idUser
     * @param $deviceToken
     * @return mixed
     * @throws Exception
     */
    public function updateTokens($idUser, $deviceToken, $generateToken = true)
    {
        if ($generateToken) {
            $apiToken = (new TokenApi)->generate($idUser);
            $this->sqlUpdate(
                ['deviceToken' => ':deviceToken', 'api_token' => ':api_token'],
                [['idUser', '=', $idUser]],
                [':deviceToken' => $deviceToken, ':api_token' => $apiToken]
            );

            return ['deviceToken' => $deviceToken, 'api_token' => $apiToken];
        }

        $this->sqlUpdate(
            ['deviceToken' => ':deviceToken'],
            [['idUser', '=', $idUser]],
            [':deviceToken' => $deviceToken]
        );

        return ['deviceToken' => $deviceToken];
    }

    /**
     * @param $idUser
     * @return string
     * @throws Exception
     */
    public function updateApiToken($idUser)
    {
        $apiToken = (new TokenApi)->generate($idUser);

        $this->sqlUpdate(
            ['api_token' => ':api_token'],
            [['idUser', '=', $idUser]],
            [':api_token' => $apiToken]
        );

        return $apiToken;
    }

    /**
     * @param $userId
     * @param $deviceToken
     * @return bool
     * @throws Exception
     */
    public function updateDeviceToken($userId, $deviceToken)
    {
        return $this->sqlUpdate(
            ['deviceToken' => ':deviceToken'],
            [['idUser', '=', $userId]],
            [':deviceToken' => $deviceToken]
        );
    }

    /**
     * @param $userId
     * @param $platform
     * @return bool
     * @throws Exception
     */
    public function updatePlatform($userId, $platform)
    {
        return $this->sqlUpdate(
            ['platform' => ':platform'],
            [['idUser', '=', $userId]],
            [':platform' => $platform]
        );
    }

    /**
     * @param Location $location
     * @param $userId
     * @return bool
     * @throws Exception
     */
    public function updateLocation(Location $location, $userId)
    {
        return $this->sqlUpdate([
            'last_lat' => $location->getLatitude(),
            'last_lon' => $location->getLongitude()
        ], [['idUser', '=', $userId]]);
    }

    /**
     * @param $id
     * @return array|mixed
     */
    public function findWithUserType($id)
    {
        $sql = "
            SELECT
              u.idUser,
              u.name,
              u.platform,
              la.userTypeId,
              ut.name AS type,
              isDriver
            FROM {$this->table} u
              INNER JOIN levelAccess la ON u.idUser = la.userId
              INNER JOIN userType ut ON ut.idUserType = la.userTypeId
            WHERE 
              u.idUser = :id
        ";

        $bind = [
            ':id' => $id
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findAdminUsers()
    {
        $sql = "
            SELECT
                u.*
            FROM user u
              INNER JOIN levelAccess la on u.idUser = la.userId
            WHERE 
              la.userTypeId = :adminLevelAccess AND 
              u.statusId = 1 AND
              u.blocked = 0";

        $bind = [':adminLevelAccess' => UserType::ADMINISTRADOR];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $authenticate
     * @throws Exception
     */
    private function checkAuthenticate($authenticate)
    {
        if (empty($authenticate))
            throw new Exception("Usuário ou senha inválida");

        if ($authenticate->establishmentStatusId != EstablishmentConst::ESTABLISHMENT_STATUS_ATIVO)
            throw new Exception("Status do estabelecimento não permite login");
    }

    public function updateQuantityTrips(int $idUser)
    {
        return $this->sqlRawUpdate("
            UPDATE user
            SET quantityTrips = (
                    SELECT COUNT(idTrip)
                    FROM trip
                    WHERE status = 'finished'
                      AND (
                        userId = user.idUser
                        OR centralCustomerId IN (SELECT id FROM centralCustomer WHERE userId = user.idUser)
                      )
                )
            WHERE idUser = :idUser;
        ",
            [':idUser' => $idUser]);
    }

    public function removeUser($idUser)
    {
        $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [['idUser', '=', $idUser]],
            [':statusId' => Status::EXCLUIDO]
        );
    }

    public function checkAccountAppPartner($email)
    {
        $SqlGetUserFinded = "
        SELECT key_app_partner, email, document
        FROM user
        WHERE email = :email
          AND key_app_partner IS NOT NULL
          AND statusId = 1
        ORDER BY idUser DESC
        LIMIT 1;
        ";

        $bindUserFinded = [
            ':email' => $email,
        ];

        $responseUserFinded = $this->sqlRawSelect($SqlGetUserFinded, $bindUserFinded)->get(false);

        if (!$responseUserFinded) {
            throw new Exception("Usuário não encontrado ou não possui app partner associado");
        }

        $SqlGetAppPartner = "
        SELECT config.*
        FROM config_apps_partners AS config
        WHERE config.key = :keyAppPartner;
        ";

        $bindAppPartner = [
            ':keyAppPartner' => $responseUserFinded->key_app_partner
        ];

        return $this->sqlRawSelect($SqlGetAppPartner, $bindAppPartner)->get(false);
    }
    
    /**
     * Encontra um usuário ativo com imagem de perfil associada.
     * 
     * @param $idUser
     * @return array|mixed
     */
    public function findWithProfileImage($idUser)
    {
        $sql = "
            SELECT
                u.*,
                c.profileImage
            FROM {$this->table} u
            INNER JOIN customer c ON c.userId = u.idUser
            WHERE 
                u.idUser = :idUser AND 
                u.statusId = :statusId
        ";

        $bind = [
            ':idUser' => $idUser,
            ':statusId' => User::STATUS_ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)->get(false);
    }
}