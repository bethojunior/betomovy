<?php

namespace app\dao;

use app\exceptions\WithdrawException;
use app\services\WithdrawService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\validator\WithdrawValidator;
use app\model\Bank;
use app\model\BankAccount;
use app\model\Config;
use app\model\ConfigType;
use app\model\Driver;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogType;
use app\model\User;
use app\model\Withdraw;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2018
 * Time: 11:31
 */
class WithdrawDao extends BaseDao
{
    private $validator;
    private $service;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->validator = new WithdrawValidator;
        $this->service = new WithdrawService;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $request
     * @return string
     * @throws Exception
     */
    public function new($request): string
    {
        try {
            $this->validator->validateNewWithdraw($request);

            if($this->duplicity($request)) {
                throw new Exception("Duplicidade. Espere alguns minutos para realizar novamente a transferência");
            }

            $driver = (new DriverDao)
                ->find($request->driverId, true, true);

            if (!(new BankAccountDao)->hasWithdrawDestination($driver->bankAccountId ?? null)) {
                throw new Exception("Cadastre uma conta bancária ou chave Pix para solicitar o saque");
            }

            $this->beginTransaction();

            $withdraw = $this->createWithdraw($request->driverId, $request->value);

            (new BalanceDao)->driverWithdraw($withdraw);

            $this->commit();

            $resultEmail = $this->service->sendEmailWithdrawRequest(
                new User($driver),
                $withdraw);

            $logData = (object)[
                'driver' => $driver,
                'withdraw' => $withdraw->toStdClass(),
                'resultEmail' => $resultEmail
            ];

            $this->logDriverWithdraw(
                $logData,
                $driver->idDriver,
                $driver->userId,
                "MOTORISTA SOLICITOU UMA TRANSFERENCIA"
            );

        } catch (Exception $e) {
            $this->rollback();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $withdraw->getMessConfirmationCode();
    }

    public function duplicity($request):bool
    {
        $dateNow = date("Y-m-d H:i:s");

        $result = $this->sqlRawSelect(
            /** @lang sql */"
            SELECT
                w.created_at
            FROM {$this->table} w
                INNER JOIN balance b on w.balanceId = b.idBalance
                INNER JOIN driver d ON d.balanceId = b.idBalance
                WHERE d.idDriver = :idDriver
            ORDER BY w.idWithdraw DESC
        ", [
            ':idDriver' => $request->driverId
        ])->get();

        if (empty($result)) {
            return false;
        }

        $difference = diffInSeconds($result[0]->created_at, $dateNow);

        if(intval($difference) > 60) {
            return false;
        }

        return true;
    }

    public function getAll()
    {
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $bankAccountTable = (new BankAccount)->getTableName();
        $bankTable = (new Bank)->getTableName();

        $sql = "
            SELECT
              w.created_at,
              u.name,
              u.email,
              w.value,
              w.paymentDate,
              w.confirmationCode,
              u.bankAccountId,
              CONCAT(
                  b.bankNumber ,' - ', b.bankName
              ) AS bankName,
              ba.op,
              ba.agency,
              ba.agencyDigit,
              CONCAT(
                  ba.numberAccount ,'-', ba.numberAccountDigit
              ) AS numberAccount,
              ba.holderName,
              ba.document,
              ba.typeAccount
            FROM {$this->table} w
              INNER JOIN {$driverTable} d ON w.balanceId = d.balanceId
              INNER JOIN {$userTable} u ON d.userId = u.idUser
              INNER JOIN {$bankAccountTable} ba on u.bankAccountId = ba.idBankAccount
              INNER JOIN {$bankTable} b on ba.bankId = b.idBank
            ORDER BY w.created_at DESC
        ";

        $withdraws = $this->sqlRawSelect($sql)
            ->get();

        return $withdraws;
    }

    /**
     * @param int $driverId
     * @param float $value
     * @return Withdraw
     * @throws Exception
     */
    private function createWithdraw(int $driverId, float $value): Withdraw
    {
        $balance = $this->getDriverBalanceAndValidateValue($driverId, $value);
        $userId = (new DriverDao)
            ->find($driverId, false, false)
            ->userId;

        $withdraw = new Withdraw;
        $withdraw
            ->setValue($value)
            ->setBalanceId($balance->idBalance)
            ->setUserId($userId)
            ->setIdWithdraw($this->sqlInsert($withdraw));

        return $withdraw;
    }

    /**
     * @param int $driverId
     * @param float $value
     * @return array|mixed
     * @throws Exception
     */
    private function getDriverBalanceAndValidateValue(int $driverId, float $value)
    {
        $minimumValue = (float)Config::get('minimum_value_for_withdraw', ConfigType::DRIVER);

        if ($value < $minimumValue)
            throw new WithdrawException(400, ['minimunValue' => $minimumValue]);

        $balanceDao = new BalanceDao;

        $balance = $balanceDao->findByDriver($driverId);

        if ($balance->balance < $value)
            throw new WithdrawException(401);

        return $balance;
    }

    /**
     * @param $data
     * @param $idReference
     * @param $userId
     * @param $message
     * @return bool
     * @throws Exception
     */
    private function logDriverWithdraw($data, $idReference, int $userId, string $message)
    {
        $log = new Log(LogType::PROCESS);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::DRIVER)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }

    /**
     * @param string $confirmationCode
     * @return array|mixed
     * @throws Exception
     */
    public function find(string $confirmationCode)
    {
        $driverTable = (new Driver)->getTableName();
        $userTable = (new User)->getTableName();
        $bankAccountTable = (new BankAccount)->getTableName();
        $bankTable = (new Bank)->getTableName();

        $sql = "
            SELECT
              w.created_at,
              u.name,
              u.email,
              w.value,
              w.paymentDate,
              w.confirmationCode,
              u.bankAccountId,
              CONCAT(
                  b.bankNumber ,' - ', b.bankName
              ) AS bankName,
              ba.op,
              ba.agency,
              ba.agencyDigit,
              CONCAT(
                  ba.numberAccount ,'-', ba.numberAccountDigit
              ) AS numberAccount,
              ba.holderName,
              ba.document,
              ba.typeAccount
            FROM {$this->table} w
              INNER JOIN {$driverTable} d ON w.balanceId = d.balanceId
              INNER JOIN {$userTable} u ON d.userId = u.idUser
              INNER JOIN {$bankAccountTable} ba on u.bankAccountId = ba.idBankAccount
              INNER JOIN {$bankTable} b on ba.bankId = b.idBank
            WHERE 
               w.confirmationCode = :confirmationCode
            ORDER BY w.created_at DESC
        ";

        $withdraw = $this->sqlRawSelect($sql, [':confirmationCode' => $confirmationCode])
            ->get(false);

        if (empty($withdraw)) {
            throw new Exception("Nenhuma transferencia encontrada");
        }

        return $withdraw;
    }

}