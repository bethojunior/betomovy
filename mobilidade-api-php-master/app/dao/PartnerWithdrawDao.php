<?php

namespace app\dao;

use app\exceptions\WithdrawException;
use app\services\WithdrawService;
use app\utils\BaseDao;
use app\utils\Connection;
use app\validator\WithdrawValidator;
use app\model\Config;
use Exception;
use app\model\Log;
use app\model\LogApp;
use app\model\LogType;
use app\model\User;
use app\model\Withdraw;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2018
 * Time: 10:24
 */
class PartnerWithdrawDao extends BaseDao
{
    protected $table = 'withdraw';
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
            $this->validator->validatePartnerNewWithdraw($request);

            $this->beginTransaction();

            $withdraw = $this->createWithdraw($request->customerId, $request->value);

            (new CustomerPartnerBalanceDao)
                ->withdraw($withdraw);

            $this->commit();

            $customer = (new CustomerPartnerDao)
                ->findWithUser($request->customerId);

            $resultEmail = $this->service
                ->sendEmailWithdrawRequest(new User($customer), $withdraw);

            $logData = (object)[
                'partner' => $customer,
                'withdraw' => $withdraw->toStdClass(),
                'resultEmail' => $resultEmail
            ];

            $this->logWithdraw(
                $logData,
                $customer->idCustomer,
                $customer->idUser,
                "PARCEIRO SOLICITOU UMA TRANSFERENCIA"
            );

        } catch (Exception $e) {
            $this->rollback();
            throw $e;
        }

        return $withdraw->getMessConfirmationCode();
    }

    /**
     * @param int $customerId
     * @param float $value
     * @return \app\model\Withdraw
     * @throws Exception
     */
    private function createWithdraw(int $customerId, float $value): Withdraw
    {
        $balance = $this->getBalanceAndValidateValue($customerId, $value);
        $userId = (new CustomerPartnerDao)
            ->find($customerId)
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
     * @param int $customerId
     * @param float $value
     * @return array|mixed
     * @throws Exception
     */
    private function getBalanceAndValidateValue(int $customerId, float $value)
    {
        $minimumValue = (float)Config::get('minimum_value_for_partner_withdraw');

        if ($value < $minimumValue)
            throw new WithdrawException(400, ['minimunValue' => $minimumValue]);

        $balance = (new BalanceDao)->findByPartner($customerId);

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
    private function logWithdraw($data, $idReference, int $userId, string $message)
    {
        $log = new Log(LogType::PROCESS);
        $log->setData($data)
            ->setIdReference($idReference)
            ->setUserId($userId)
            ->setApp(LogApp::PWA)
            ->setMessage($message);

        return (new LogDao)->insert($log);
    }
}