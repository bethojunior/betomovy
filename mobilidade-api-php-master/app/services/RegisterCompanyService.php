<?php

namespace app\services;

use app\dao\BalanceDao;
use app\dao\CompanyDao;
use app\dao\CompanyWorkerDao;
use app\dao\LevelAccessDao;
use app\dao\LogDao;
use app\dao\UserDao;
use app\exceptions\CompanyException;
use app\exceptions\CompanyWorkerException;
use app\utils\Connection;
use app\utils\FormatValue;
use app\validator\CompanyValidator;
use app\model\Balance;
use app\model\Company;
use app\model\CompanyWorker;
use Exception;
use app\model\LevelAccess;
use app\model\User;
use app\model\UserType;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 17:22
 */
class RegisterCompanyService
{
    private $validator;
    private $dao;
    private $companyWorkerDao;
    private $userDao;
    private $conn;
    private $balanceDao;
    private $levelAccessDao;

    public function __construct()
    {
        $this->conn = Connection::open();
        $this->validator = new CompanyValidator;
        $this->dao = new CompanyDao;
        $this->companyWorkerDao = new CompanyWorkerDao;
        $this->userDao = new UserDao;
        $this->balanceDao = new BalanceDao;
        $this->levelAccessDao = new LevelAccessDao;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function register($request)
    {
        try {
            $this->conn->beginTransaction();

            $this->validateRegister($request);

            /** @var \app\model\Balance $balance */
            $balance = $this->balanceDao->create();

            $company = new Company;
            $company
                ->setEmail(trim($request->email))
                ->setPhone(FormatValue::formatPhoneClear($request->phone))
                ->setDocument(FormatValue::formatDocumentClear($request->document))
                ->setName($request->name ?? null)
                ->setFantasyName($request->fantasyName)
                ->setCityId($request->cityId)
                ->setAddress($request->address)
                ->setLatitude($request->latitude)
                ->setLongitude($request->longitude)
                ->setBalanceId($balance->getIdBalance())
                ->setId(
                    $this->dao
                        ->sqlInsert($company)
                );

            $companyWorker = $request->companyWorker;

            $user = new User;
            $user
                ->setName($companyWorker->name)
                ->setNickname($companyWorker->nickname)
                ->setDocument(FormatValue::formatDocumentClear($companyWorker->document))
                ->setPhone(FormatValue::formatPhoneClear($companyWorker->phone))
                ->setPassword($companyWorker->password)
                ->setEmail(trim($companyWorker->email))
                ->setIdUser(
                    $this->userDao
                        ->sqlInsert($user)
                );

            $levelAccess = new LevelAccess;
            $levelAccess
                ->setUserTypeId(UserType::COLABORADOR)
                ->setUserId($user->getIdUser())
                ->setIdLevelAccess(
                    $this->levelAccessDao
                        ->sqlInsert($levelAccess)
                );

            $companyWorker = new CompanyWorker;
            $companyWorker
                ->setUserId($user->getIdUser())
                ->setCompanyId($company->getId())
                ->setId(
                    $this->companyWorkerDao
                        ->sqlInsert($companyWorker)
                );

            $this->conn->commit();

        } catch (Exception $e) {
            $this->conn->rollBack();
            (new LogDao)->logException($e);

            throw $e;
        }

        return [
            'company' => $company->toStdClass(),
            'companyWorker' => array_merge(
                [
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'phone' => $user->getPhone(),
                ],
                $companyWorker->toArray()
            )
        ];
    }

    /**
     * @param $request
     * @return bool
     * @throws CompanyException
     * @throws Exception
     */
    private function validateRegister($request)
    {
        $this->validator->validateRegisterCompany($request);

        $emailExists = $this->dao
            ->findByField('email', trim($request->email));
        if ($emailExists)
            throw new CompanyException(1540);

        $documentExists = $this->dao
            ->findByField('document', FormatValue::formatDocumentClear($request->document));
        if ($documentExists)
            throw new CompanyException(1541);

        $phoneExists = $this->dao
            ->findByField('phone', FormatValue::formatPhoneClear($request->phone));
        if ($phoneExists)
            throw new CompanyException(1542);

        $this->validateRegisterCompanyWorker($request);

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws CompanyWorkerException
     */
    private function validateRegisterCompanyWorker($request)
    {
        $companyWorker = $request->companyWorker;

        $emailExists = $this->companyWorkerDao
            ->findByField('email', trim($companyWorker->email));
        if ($emailExists)
            throw new CompanyWorkerException(1560);

        $documentExists = $this->companyWorkerDao
            ->findByField('document', FormatValue::formatDocumentClear($companyWorker->document));
        if ($documentExists)
            throw new CompanyWorkerException(1561);

        $phoneExists = $this->companyWorkerDao
            ->findByField('phone', FormatValue::formatPhoneClear($companyWorker->phone));
        if ($phoneExists)
            throw new CompanyWorkerException(1562);

        return true;
    }
}