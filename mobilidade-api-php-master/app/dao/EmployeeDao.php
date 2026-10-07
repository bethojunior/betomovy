<?php

namespace app\dao;

use app\exceptions\InvalidFieldEmployeeException;
use app\utils\BaseDao;
use app\utils\Connection;
use app\validator\EmployeeValidator;
use app\model\Balance;
use app\model\BankAccount;
use app\model\Employee;
use Exception;
use app\model\User;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:44
 */
class EmployeeDao extends BaseDao
{
    private $validator;

    public function __construct($conn = null, string $sql = Connection::DB_MYSQL)
    {
        $this->validator = new EmployeeValidator;
        parent::__construct($conn, $sql);
    }

    /**
     * @param $data
     * @return \app\model\Employee
     * @throws Exception
     */
    public function register($data): Employee
    {
        try {
            $this->beginTransaction();

            $establishment = (new EstablishmentDao)
                ->createPreRegister($data);

            $employee = $this->createNew(
                $data->user,
                $establishment->getIdEstablishment(),
                UserType::COLABORADOR_PARCEIRO
            );

            $this->commit();
        } catch (Exception $e) {
            $this->rollBack();
            (new LogDao)->logException($e);
            throw $e;
        }

        return $employee;
    }

    /**
     * @param $data
     * @param $establishmentId
     * @param $userType
     * @return Employee
     * @throws Exception
     */
    public function createNew($data, $establishmentId, $userType): Employee
    {
        try {
            $this->validator->validateEmployee($data);

            $levelAccessDao = new LevelAccessDao;
            $userDao = new UserDao;

            $user = new User($data, $userType);

            $this->checkEmailExists($user->getEmail());

            if (isset($data->bankAccount)) {
                $user->setBankAccountId((new BankAccountDao)->sqlInsert(new BankAccount($data->bankAccount)));
            }

            $user->setIdUser($userDao->sqlInsert($user));

            $levelAccessDao->createNew($user->getIdUser(), $userType);

            /** @var \app\model\Balance $balance */
            $balance = (new BalanceDao)->create();

            $employee = new Employee($data);
            $employee->setUserId($user->getIdUser());
            $employee->setEstablishmentId($establishmentId);
            $employee->setBalanceId($balance->getIdBalance());
            $employee->setIdEmployee($this->sqlInsert($employee));

            return $employee;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function findByUserId($userId, $fields = [])
    {
        return $this->sqlSelect($fields, [['userId', '=', ':userId']])
            ->bind(['userId' => $userId])
            ->get(false);
    }

    /**
     * @param $email
     * @throws Exception
     * @throws InvalidFieldEmployeeException
     */
    private function checkEmailExists($email)
    {
        $userExists = (new UserDao)->getByEmail($email);

        if ($userExists)
            throw new InvalidFieldEmployeeException("Email do colaborador já existe", 'email');
    }
}