<?php

namespace app\services;

use app\dao\CustomerDao;
use app\dao\DependentUserDao;
use app\exceptions\CheckoutServiceException;
use app\validator\DependentUserValidator;
use app\model\DependentUser;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/12/2019
 * Time: 10:42
 */
class DependentUserService
{
    private $dao;
    private $validator;
    private $customerDao;

    /**
     * DependentUserService constructor.
     * @throws CheckoutServiceException
     */
    public function __construct()
    {
        $this->dao = new DependentUserDao;
        $this->validator = new DependentUserValidator;
        $this->customerDao = new CustomerDao;
    }

    /**
     * @param $request
     * @param $responsibleUserId
     * @return bool
     * @throws Exception
     */
    public function insert($request, $responsibleUserId)
    {
        $this->validator->validateInsert($request);

        $user = $this->customerDao
            ->register($request, null, true);

        $dependentUser = new DependentUser;
        $dependentUser
            ->setUserId($user->getIdUser())
            ->setResponsibleId($responsibleUserId)
            ->setRelationship($request->relationship)
            ->setId(
                $this->dao
                    ->sqlInsert($dependentUser));

        return true;
    }

    public function findByResponsible($responsibleId)
    {
        return $this->dao
            ->getAllByResponsible($responsibleId);
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function delete($request)
    {
        $this->validator->validateDelete($request);

        return $this->dao
            ->delete($request->dependentUserId);
    }
}