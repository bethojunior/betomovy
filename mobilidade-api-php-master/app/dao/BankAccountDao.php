<?php

namespace app\dao;

use app\services\BankAccountService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\utils\Headers;
use app\validator\BankAccountValidator;
use app\model\Bank;
use app\model\BankAccount;
use app\model\Driver;
use Exception;
use stdClass;
use app\model\User;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:44
 */
class BankAccountDao extends BaseDao
{
    protected $table = "bankAccount";
    private $service;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->service = new BankAccountService;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $request
     * @return stdClass
     * @throws Exception
     */
    public function insert($request)
    {
        (new BankAccountValidator)->validateBankAccount($request);

        $this->bindAuthenticatedOwner($request);

        $userDao = new UserDao;

        $user = $userDao->sqlSelect(['bankAccountId'], [['idUser', '=', ':idUser']])
            ->bind([':idUser' => $request->userId])
            ->get(false);

        if ($user->bankAccountId)
            throw new Exception("Usuario ja possui conta bancária");

        /** @var BankAccount $bankAccount */
        $bankAccount = $this->create($request);

        $userDao->sqlUpdate(
            ['bankAccountId' => ':bankAccountId'],
            [['idUser', '=', ':idUser']],
            [':idUser' => $request->userId, ':bankAccountId' => $bankAccount->getIdBankAccount()]
        );

        if ($request->driverId && $request->dateOfBirth) {
            try {
                $this->updateDataDriverAddress($request);
            }
            catch (Exception $e) {
            }
        }

        return $bankAccount->toStdClass();
    }

    /**
     * @param $request
     * @return array|mixed
     * @throws Exception
     */
    public function edit($request)
    {
        (new BankAccountValidator)->validateUpdateBankAccount($request);

        $this->bindAuthenticatedOwner($request);
        $this->assertBankAccountOwner($request->userId, $request->idBankAccount ?? null);

        if ($request->driverId && $request->dateOfBirth) {
            try {
                $this->updateDataDriverAddress($request);
            }
            catch (Exception $e) {
            }
        }

        $bankAccount = new BankAccount($request);

        $this->update($bankAccount);

        return $this->find($bankAccount->getIdBankAccount());
    }

    /**
     * Dono da conta (userId/driverId) sempre vem do token, nunca do body
     * @param $request
     * @throws Exception
     */
    private function bindAuthenticatedOwner($request): void
    {
        $userId = Headers::getUserId();

        if (empty($userId))
            throw new Exception("Usuário não identificado");

        $request->userId = (int)$userId;

        if (!empty($request->driverId)) {
            $driver = (new DriverDao)->sqlSelect(['idDriver'], [['userId', '=', ':userId']])
                ->bind([':userId' => $request->userId])
                ->get(false);

            $request->driverId = $driver->idDriver ?? null;
        }
    }

    /**
     * @param int $userId
     * @param $idBankAccount
     * @throws Exception
     */
    private function assertBankAccountOwner(int $userId, $idBankAccount): void
    {
        $user = (new UserDao)->sqlSelect(['bankAccountId'], [['idUser', '=', ':idUser']])
            ->bind([':idUser' => $userId])
            ->get(false);

        if (empty($idBankAccount) || !$user || (int)$user->bankAccountId !== (int)$idBankAccount)
            throw new Exception("Conta bancária não pertence ao usuário");
    }

    public function updateDataDriverAddress($request)
    {
        if(!$request->zipCode || !$request->dateOfBirth) {
            return;
        }
        $driverAddressDao = new DriverAddressDao;
        $userDao = new UserDao;
        $userDao->sqlUpdate(
            ['dateOfBirth' => ':dateOfBirth'],
            [['idUser', '=', ':idUser']],
            [':idUser' => $request->userId, ':dateOfBirth' => $request->dateOfBirth]
        );

        $userDao->sqlUpdate(
            ['zipcode' => ':zipcode'],
            [['idUser', '=', ':idUser']],
            [':idUser' => $request->userId, ':zipcode' => $request->zipCode]
        );
        $driverAddressDao->addOrUpdateDriverAddress($request);
       
    }

    /**
     * @param int $bankAccountId
     * @return array|mixed
     */
    public function find(int $bankAccountId)
    {
        return $this->sqlSelect([], [['idBankAccount', '=', ':idBankAccount']])
            ->bind([':idBankAccount' => $bankAccountId])
            ->get(false);
    }

    /**
     * @param BankAccount $bankAccount
     * @return bool
     * @throws Exception
     */
    public function update(BankAccount $bankAccount)
    {
        $editMounted = $this->service->mountEditBankAccount($bankAccount);

        return $this->sqlUpdate($editMounted['set'], [$editMounted['where']], $editMounted['bind']);
    }

    /**
     * @param $idBankAccount
     * @return string
     */
    public function getBankAccountLikeString($idBankAccount): string
    {
        $bankAccount = $this->findWithBank($idBankAccount);

        if (!$bankAccount)
            return 'Conta não informada';

        if ($this->hasBankData($bankAccount))
            return $this->mountFullBankAccountString($bankAccount);

        if (!empty($bankAccount->pix))
            return "PIX: {$bankAccount->pix}, " . $this->mountHolderString($bankAccount);

        return 'Conta não informada';
    }

    /**
     * @param int|null $idBankAccount
     * @return bool
     */
    public function hasWithdrawDestination($idBankAccount): bool
    {
        if (empty($idBankAccount))
            return false;

        $bankAccount = $this->findWithBank($idBankAccount);

        if (!$bankAccount)
            return false;

        return $this->hasBankData($bankAccount) || !empty($bankAccount->pix);
    }

    /**
     * @param $idBankAccount
     * @return array|mixed
     */
    private function findWithBank($idBankAccount)
    {
        $bankTable = (new Bank)->getTableName();

        $sql = "
            SELECT ba.*, b.bankNumber, b.bankName
            FROM {$this->table} ba
              LEFT JOIN {$bankTable} b on ba.bankId = b.idBank
            WHERE ba.idBankAccount = :idBankAccount
        ";

        return $this->sqlRawSelect($sql, [':idBankAccount' => $idBankAccount])
            ->get(false);
    }

    private function hasBankData($bankAccount): bool
    {
        return !empty($bankAccount->bankName)
            && !empty($bankAccount->agency)
            && !empty($bankAccount->numberAccount);
    }

    private function mountFullBankAccountString($bankAccount): string
    {
        $agencyDigit = $bankAccount->agencyDigit ? "-{$bankAccount->agencyDigit}" : '';
        $accountDigit = $bankAccount->numberAccountDigit ? "-{$bankAccount->numberAccountDigit}" : '';

        return "Banco: {$bankAccount->bankNumber} - {$bankAccount->bankName}, "
            . "Agencia: {$bankAccount->agency}{$agencyDigit}, "
            . "Numero da Conta: {$bankAccount->numberAccount}{$accountDigit}, "
            . "Tipo da conta: {$bankAccount->typeAccount}, "
            . (!empty($bankAccount->pix) ? "PIX: {$bankAccount->pix}, " : '')
            . $this->mountHolderString($bankAccount);
    }

    private function mountHolderString($bankAccount): string
    {
        return "Titular: {$bankAccount->holderName}, Documento: {$bankAccount->document}";
    }

    /**
     * @param $driverId
     * @return array|mixed
     * @throws Exception
     */
    private function findByDriver($driverId)
    {
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();

        $sql = "
            SELECT
              ba.*
            FROM {$this->table} ba
              INNER JOIN {$userTable} u on ba.idBankAccount = u.bankAccountId
              INNER JOIN {$driverTable} d on u.idUser = d.userId
            WHERE d.idDriver = :idDriver
        ";

        $bankAccount = $this->sqlRawSelect($sql, [':idDriver' => $driverId])
            ->get(false);

        if (!$bankAccount)
            throw new Exception("Conta bancária não encontrada");

        return $bankAccount;
    }

    /**
     * @param int $userId
     * @return array|mixed
     * @throws Exception
     */
    public function getByUserId(int $userId)
    {
        $sql = "
            SELECT
              ba.*,
              b.bankName
            FROM {$this->table} ba
              INNER JOIN user u on ba.idBankAccount = u.bankAccountId
              INNER JOIN bank b ON ba.bankId = b.idBank
            WHERE u.idUser = :idUser
        ";

        $bankAccount = $this->sqlRawSelect($sql, [':idUser' => $userId])
            ->get(false);

        return $bankAccount;
    }
}